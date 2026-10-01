import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || undefined;
  const faqs = await db.getFaqs(category);
  return NextResponse.json({
    success: true,
    faqs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json(
        { success: false, error: "Missing required FAQ fields (question, answer)" },
        { status: 400 }
      );
    }

    const faq = await db.createFaq({
      question: body.question,
      answer: body.answer,
      category: body.category || "General",
      order: Number(body.order) || 99,
    });

    await db.addAuditLog({
      action: "FAQ_CREATED",
      actorEmail: "admin@nexuscore.dev",
      target: `FAQ: ${body.question.substring(0, 30)}...`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      faq,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "FAQ ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.updateFaq(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "FAQ_UPDATED",
      actorEmail: "admin@nexuscore.dev",
      target: `FAQ ID: ${body.id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      faq: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update FAQ" },
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
        { success: false, error: "FAQ ID parameter is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteFaq(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "FAQ_DELETED",
      actorEmail: "admin@nexuscore.dev",
      target: `FAQ ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
