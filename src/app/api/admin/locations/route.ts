import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await db.getLocations();
  return NextResponse.json({
    success: true,
    locations,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.testCenterName) {
      return NextResponse.json(
        { success: false, error: "Name and test center name are required" },
        { status: 400 }
      );
    }

    const location = await db.createLocation({
      name: body.name,
      postcodes: Array.isArray(body.postcodes) ? body.postcodes : (body.postcodes ? body.postcodes.split(",").map((p: string) => p.trim()) : []),
      activeInstructors: Number(body.activeInstructors) || 1,
      testCenterName: body.testCenterName,
    });

    await db.addAuditLog({
      action: "LOCATION_CREATED",
      actorEmail: "admin@nexuscore.dev",
      target: `Area: ${body.name}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      location,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create location" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Location ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.updateLocation(body.id, {
      ...body,
      postcodes: Array.isArray(body.postcodes) ? body.postcodes : (body.postcodes ? body.postcodes.split(",").map((p: string) => p.trim()) : undefined),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LOCATION_UPDATED",
      actorEmail: "admin@nexuscore.dev",
      target: `Location ID: ${body.id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      location: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Location ID parameter is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteLocation(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LOCATION_DELETED",
      actorEmail: "admin@nexuscore.dev",
      target: `Location ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete location" },
      { status: 500 }
    );
  }
}
