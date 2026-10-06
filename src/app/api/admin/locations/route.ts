import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  const locations = await db.getLocations();
  return NextResponse.json({
    success: true,
    locations,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (!body.name || !body.testCenterName) {
      return NextResponse.json(
        { success: false, error: "Name and test center name are required" },
        { status: 400 }
      );
    }

    const postcodes = Array.isArray(body.postcodes)
      ? body.postcodes
      : body.postcodes
      ? body.postcodes.split(",").map((p: string) => p.trim().toUpperCase()).filter(Boolean)
      : [];

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const location = await db.createLocation({
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || "",
      coverageText: body.coverageText?.trim() || "DVSA test route & intensive tuition",
      postcodes,
      activeInstructors: Number(body.activeInstructors) || 1,
      testCenterName: body.testCenterName.trim(),
      latitude: body.latitude !== undefined && body.latitude !== "" ? Number(body.latitude) : 53.4808,
      longitude: body.longitude !== undefined && body.longitude !== "" ? Number(body.longitude) : -2.2426,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.addAuditLog({
      action: "LOCATION_CREATED",
      actorEmail: session.user.email,
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
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Location ID is required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    if (body.postcodes !== undefined) {
      updatePayload.postcodes = Array.isArray(body.postcodes)
        ? body.postcodes
        : body.postcodes
        ? body.postcodes.split(",").map((p: string) => p.trim().toUpperCase()).filter(Boolean)
        : [];
    }
    if (body.latitude !== undefined && body.latitude !== "") {
      updatePayload.latitude = Number(body.latitude);
    }
    if (body.longitude !== undefined && body.longitude !== "") {
      updatePayload.longitude = Number(body.longitude);
    }
    if (body.activeInstructors !== undefined) {
      updatePayload.activeInstructors = Number(body.activeInstructors);
    }
    if (body.displayOrder !== undefined) {
      updatePayload.displayOrder = Number(body.displayOrder);
    }
    if (body.isActive !== undefined) {
      updatePayload.isActive = Boolean(body.isActive);
    }

    const updated = await db.updateLocation(body.id, updatePayload);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LOCATION_UPDATED",
      actorEmail: session.user.email,
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
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

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
      actorEmail: session.user.email,
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
