import { NextResponse } from "next/server";
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
    const analytics = await db.getPopupAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load popup analytics" },
      { status: 500 }
    );
  }
}
