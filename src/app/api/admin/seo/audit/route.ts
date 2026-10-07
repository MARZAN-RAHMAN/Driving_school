import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const audit = await db.runSEOAudit();

    await db.addAuditLog({
      action: "SEO_AUDIT_EXECUTED",
      actorEmail: session.user.email,
      target: `Full SEO Health Check (Score: ${audit.score}/100 - ${audit.healthRating})`,
      ip: "127.0.0.1",
      severity: audit.score >= 80 ? "SUCCESS" : "WARNING",
    });

    return NextResponse.json({
      success: true,
      audit,
      message: `Audit completed: Score ${audit.score}/100 (${audit.healthRating})`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to run SEO audit",
      },
      { status: 500 }
    );
  }
}
