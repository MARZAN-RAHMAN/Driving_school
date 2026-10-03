import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const campaign = await db.getPopupCampaign(true);
    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Failed to fetch popup config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popup configuration" },
      { status: 500 }
    );
  }
}
