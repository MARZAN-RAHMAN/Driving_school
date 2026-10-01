import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { BusinessSettings } from "@/types";

export async function GET() {
  const session = await getSession();

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Admin or Editor session required" },
      { status: 403 }
    );
  }

  const settings = await db.getBusinessSettings();

  return NextResponse.json({
    settings,
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();

  // Only full ADMIN role can modify business settings
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Admin privileges required to update business settings" },
      { status: 403 }
    );
  }

  try {
    const body: Partial<BusinessSettings> = await request.json();

    if (body.businessName && body.businessName.trim().length === 0) {
      return NextResponse.json(
        { error: "Business name cannot be empty" },
        { status: 400 }
      );
    }

    if (body.hourlyRateManual !== undefined && Number(body.hourlyRateManual) <= 0) {
      return NextResponse.json(
        { error: "Manual hourly rate must be greater than 0" },
        { status: 400 }
      );
    }

    if (body.hourlyRateAutomatic !== undefined && Number(body.hourlyRateAutomatic) <= 0) {
      return NextResponse.json(
        { error: "Automatic hourly rate must be greater than 0" },
        { status: 400 }
      );
    }

    const updated = await db.updateBusinessSettings(body);

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    await db.addAuditLog({
      action: "SETTINGS_UPDATED",
      actorEmail: session.user.email,
      target: "Driving School Business Settings (Rates, Operating Hours, DVSA)",
      ip: clientIp,
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      settings: updated,
      message: "Business settings successfully updated and applied",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update business settings" },
      { status: 500 }
    );
  }
}
