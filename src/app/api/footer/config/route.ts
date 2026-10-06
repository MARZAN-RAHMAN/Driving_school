import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const published = await db.getFooterSettings(true);
    return NextResponse.json({
      success: true,
      footer: published,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer configuration" },
      { status: 500 }
    );
  }
}
