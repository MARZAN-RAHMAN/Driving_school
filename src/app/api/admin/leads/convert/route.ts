import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { leadId, instructorId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const result = await db.convertLeadToStudent(leadId, instructorId);
    if (!result) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await db.addAuditLog({
      action: "LEAD_CONVERTED_TO_STUDENT",
      actorEmail: user.email,
      target: `Lead ${leadId} -> Student ${result.student.id} (${result.student.name})`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Lead successfully converted to registered student.",
      student: result.student,
      inquiry: result.inquiry,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to convert lead" },
      { status: 500 }
    );
  }
}
