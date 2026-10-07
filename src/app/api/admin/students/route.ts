import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || undefined;
  const status = searchParams.get("status") || undefined;

  const students = await db.getStudents(query, status);

  return NextResponse.json({
    success: true,
    students,
    total: students.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required" },
        { status: 400 }
      );
    }

    const student = await db.createStudent({
      name: body.name,
      email: body.email,
      phone: body.phone,
      postcode: body.postcode || "Manchester",
      theoryStatus: body.theoryStatus || "STUDYING",
      hoursCompleted: Number(body.hoursCompleted) || 0,
      assignedInstructorId: body.assignedInstructorId || "inst_01",
      assignedInstructorName: body.assignedInstructorName || "Dave Miller",
      status: body.status || "ACTIVE",
      notes: body.notes || "",
      testDate: body.testDate || "",
      provisionalLicenseNumber: body.provisionalLicenseNumber || "",
    });

    await db.addAuditLog({
      action: "STUDENT_ENROLLED",
      actorEmail: session.user.email,
      target: `Student: ${student.name} (${student.id})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const studentId = body.id || body.studentId;
    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.updateStudent(studentId, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "STUDENT_UPDATED",
      actorEmail: session.user.email,
      target: `Student ID: ${studentId}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update student" },
      { status: 500 }
    );
  }
}

export const PATCH = PUT;

export async function DELETE(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteStudent(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "STUDENT_REMOVED",
      actorEmail: session.user.email,
      target: `Student ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({ success: true, message: "Student removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete student" },
      { status: 500 }
    );
  }
}
