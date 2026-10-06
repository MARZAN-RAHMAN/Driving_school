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

  const packages = await db.getLessonPackages();
  return NextResponse.json({
    success: true,
    packages,
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
    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: "Title and price are required" },
        { status: 400 }
      );
    }

    const pkg = await db.createLessonPackage({
      title: body.title,
      transmission: body.transmission || "BOTH",
      durationHours: Number(body.durationHours) || 2,
      price: Number(body.price),
      level: body.level || "Beginner",
      popular: Boolean(body.popular),
      features: Array.isArray(body.features) ? body.features : [],
    });

    await db.addAuditLog({
      action: "LESSON_PACKAGE_CREATED",
      actorEmail: session.user.email,
      target: `Package: ${body.title}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      package: pkg,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create lesson package" },
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
        { success: false, error: "Package ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.updateLessonPackage(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lesson package not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LESSON_PACKAGE_UPDATED",
      actorEmail: session.user.email,
      target: `Package ID: ${body.id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      package: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update package" },
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
        { success: false, error: "Package ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteLessonPackage(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Lesson package not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LESSON_PACKAGE_DELETED",
      actorEmail: session.user.email,
      target: `Package ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "Lesson package deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete package" },
      { status: 500 }
    );
  }
}
