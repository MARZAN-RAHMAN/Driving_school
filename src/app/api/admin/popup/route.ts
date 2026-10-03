import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required" },
      { status: 403 }
    );
  }

  try {
    const draft = await db.getPopupCampaign(false);
    const published = await db.getPopupCampaign(true);

    return NextResponse.json({
      success: true,
      draft,
      published,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch popup campaign" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required" },
      { status: 403 }
    );
  }

  try {
    const updates = await req.json();
    const updated = await db.updatePopupCampaign(updates);

    return NextResponse.json({
      success: true,
      campaign: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update popup draft" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { action, isEnabled } = body;

    if (action === "publish") {
      const published = await db.publishPopupCampaign();
      return NextResponse.json({
        success: true,
        message: "Popup changes published successfully.",
        campaign: published,
      });
    }

    if (action === "toggle") {
      const updated = await db.updatePopupCampaign({ isEnabled: Boolean(isEnabled) });
      const published = await db.publishPopupCampaign();
      return NextResponse.json({
        success: true,
        message: `Website popup ${published.isEnabled ? "enabled" : "disabled"}.`,
        campaign: published,
      });
    }

    if (action === "reset") {
      const reset = await db.resetPopupCampaign();
      return NextResponse.json({
        success: true,
        message: "Popup settings reset to defaults.",
        campaign: reset,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Operation failed" },
      { status: 500 }
    );
  }
}
