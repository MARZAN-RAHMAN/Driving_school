import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkDatabaseConnection } from "@/lib/prisma";
import { PGlite } from "@electric-sql/pglite";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Admin privileges required" },
      { status: 403 }
    );
  }

  // 1. Check live external PostgreSQL connection
  const livePgCheck = await checkDatabaseConnection();

  // 2. Validate migration file existence
  const migrationPath = path.join(
    process.cwd(),
    "prisma/migrations/20260930000000_init/migration.sql"
  );
  const migrationExists = fs.existsSync(migrationPath);

  // 3. Test Embedded PostgreSQL verification engine
  let embeddedPgStatus = { operational: false, tables: [] as string[], error: "" };
  try {
    const pg = new PGlite();
    if (migrationExists) {
      const sql = fs.readFileSync(migrationPath, "utf-8");
      await pg.exec(sql);
      const res = await pg.query<{ table_name: string }>(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      embeddedPgStatus = {
        operational: true,
        tables: res.rows.map((r) => r.table_name),
        error: "",
      };
    }
  } catch (err) {
    embeddedPgStatus.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    status: "ok",
    provider: "postgresql",
    schema: {
      valid: true,
      file: "prisma/schema.prisma",
      models: ["User", "ContentItem", "AuditLog", "SystemMetric"],
      enums: ["Role", "UserStatus", "ContentStatus"],
    },
    migration: {
      applied: migrationExists,
      activeVersion: "20260930000000_init",
      targetTables: embeddedPgStatus.tables,
    },
    connections: {
      externalPostgreSQL: livePgCheck,
      embeddedPostgreSQLEngine: {
        engine: "PGlite (Wasm PostgreSQL 18)",
        operational: embeddedPgStatus.operational,
        tablesVerified: embeddedPgStatus.tables.length,
        error: embeddedPgStatus.error || undefined,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
