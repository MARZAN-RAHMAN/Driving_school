import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  const allStudents = await db.getStudents();
  const student = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  );

  return NextResponse.json({
    success: true,
    user,
    student: student || null,
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  try {
    const body = await request.json();
    const { phone, postcode, provisionalLicenseNumber } = body;

    const allStudents = await db.getStudents();
    const student = allStudents.find(
      (s) => s.email.toLowerCase() === user.email.toLowerCase()
    );

    if (!student) {
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (phone !== undefined) updates.phone = phone;
    if (postcode !== undefined) updates.postcode = postcode;
    if (provisionalLicenseNumber !== undefined)
      updates.provisionalLicenseNumber = provisionalLicenseNumber;

    const updated = await db.updateStudent(student.id, updates);

    await db.addAuditLog({
      action: "STUDENT_PROFILE_UPDATED",
      actorEmail: user.email,
      target: `Student ${student.id} (${student.name})`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 }
    );
  }
}
