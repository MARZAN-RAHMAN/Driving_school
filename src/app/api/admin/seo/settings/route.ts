import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const updated = await db.updateGlobalSEOSettings(body);
    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      settings: updated,
      audit,
      message: "Global SEO settings updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update global SEO settings",
      },
      { status: 500 }
    );
  }
}
