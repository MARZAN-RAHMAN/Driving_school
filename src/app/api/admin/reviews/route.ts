import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const featured = url.searchParams.get("featured") === "true";
  const reviews = await db.getReviews(featured);
  return NextResponse.json({
    success: true,
    reviews,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.student || !body.instructor || !body.quote) {
      return NextResponse.json(
        { success: false, error: "Missing required review fields (student, instructor, quote)" },
        { status: 400 }
      );
    }

    const review = await db.createReview({
      student: body.student,
      instructor: body.instructor,
      testCenter: body.testCenter || "London DTC",
      rating: Number(body.rating) || 5,
      result: body.result || "PASSED FIRST TIME",
      minors: body.minors || "0 Minor Faults",
      quote: body.quote,
      date: body.date || "Just now",
      verified: body.verified !== false,
      featured: Boolean(body.featured),
    });

    await db.addAuditLog({
      action: "REVIEW_CREATED",
      actorEmail: "admin@nexuscore.dev",
      target: `Review for ${body.student}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.updateReview(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "REVIEW_UPDATED",
      actorEmail: "admin@nexuscore.dev",
      target: `Review ID: ${body.id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      review: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update review" },
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
        { success: false, error: "Review ID parameter is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteReview(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "REVIEW_DELETED",
      actorEmail: "admin@nexuscore.dev",
      target: `Review ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete review" },
      { status: 500 }
    );
  }
}
