import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const instructors = await db.getInstructors(status);
  return NextResponse.json({
    success: true,
    instructors,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.badgeNumber || !body.phone || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name, badge number, phone and email are required" },
        { status: 400 }
      );
    }

    const instructor = await db.createInstructor({
      name: body.name,
      badgeNumber: body.badgeNumber,
      avatar: body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces",
      avatarPositionX: body.avatarPositionX !== undefined ? Number(body.avatarPositionX) : 50,
      avatarPositionY: body.avatarPositionY !== undefined ? Number(body.avatarPositionY) : 20,
      avatarZoom: body.avatarZoom !== undefined ? Number(body.avatarZoom) : 1,
      phone: body.phone,
      email: body.email,
      transmission: body.transmission || "BOTH",
      rating: Number(body.rating) || 5.0,
      totalPasses: Number(body.totalPasses) || 0,
      activeStudents: Number(body.activeStudents) || 0,
      status: body.status || "ACTIVE",
      vehicle: body.vehicle || "Dual-Control Vehicle",
    });

    await db.addAuditLog({
      action: "INSTRUCTOR_REGISTERED",
      actorEmail: "admin@nexuscore.dev",
      target: `Instructor: ${body.name} (${body.badgeNumber})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      instructor,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to register instructor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Instructor ID is required" },
        { status: 400 }
      );
    }

    if (body.action === "approve") {
      const approved = await db.approveInstructorApplication(body.id, "admin@nexuscore.dev");
      if (!approved) {
        return NextResponse.json(
          { success: false, error: "Instructor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        instructor: approved,
        message: "Instructor application approved successfully",
      });
    }

    if (body.action === "reject") {
      const rejected = await db.rejectInstructorApplication(body.id, "admin@nexuscore.dev");
      if (!rejected) {
        return NextResponse.json(
          { success: false, error: "Instructor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        instructor: rejected,
        message: "Instructor application rejected",
      });
    }

    const updated = await db.updateInstructor(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "INSTRUCTOR_UPDATED",
      actorEmail: "admin@nexuscore.dev",
      target: `Instructor ID: ${body.id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      instructor: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update instructor" },
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
        { success: false, error: "Instructor ID parameter is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteInstructor(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "INSTRUCTOR_REMOVED",
      actorEmail: "admin@nexuscore.dev",
      target: `Instructor ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete instructor" },
      { status: 500 }
    );
  }
}
