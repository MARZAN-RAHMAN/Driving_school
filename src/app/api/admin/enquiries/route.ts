import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { InquiryStatus, ContactInquiry } from "@/types";

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
  const status = searchParams.get("status") || undefined;
  const course = searchParams.get("course") || undefined;
  const area = searchParams.get("area") || undefined;
  const query = searchParams.get("query") || undefined;
  const sort = (searchParams.get("sort") === "oldest" ? "oldest" : "newest") as "newest" | "oldest";

  const inquiries = await db.getInquiries({
    status,
    course,
    area,
    query,
    sort,
  });

  return NextResponse.json({
    success: true,
    inquiries,
    total: inquiries.length,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { id, status, internalNotes, course, area, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const updates: Partial<ContactInquiry> = {};
    if (status !== undefined) updates.status = status as InquiryStatus;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;
    if (course !== undefined) updates.course = course;
    if (area !== undefined) updates.area = area;
    if (notes !== undefined) updates.notes = notes;

    const updated = await db.updateInquiry(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LEAD_INQUIRY_UPDATED",
      actorEmail: session.user.email,
      target: `Lead ID ${id} (${updated.name}) updated: ${
        status ? `status='${status}'` : ""
      }${internalNotes !== undefined ? " [internal notes updated]" : ""}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      inquiry: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

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
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteInquiry(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "LEAD_INQUIRY_DELETED",
      actorEmail: session.user.email,
      target: `Lead enquiry ID: ${id} deleted by ${session.user.email}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
