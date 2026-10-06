import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FAQItem } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Validates and strips dangerous HTML/script tags from input strings
 */
function sanitizeText(input?: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .trim();
}

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
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const rawQuestion = body.question ? String(body.question).trim() : "";
    const rawAnswer = body.answer ? String(body.answer).trim() : "";

    if (!rawQuestion) {
      return NextResponse.json(
        { success: false, error: "FAQ question is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (!rawAnswer) {
      return NextResponse.json(
        { success: false, error: "FAQ answer is required and cannot be empty." },
        { status: 400 }
      );
    }

    const question = sanitizeText(rawQuestion);
    const answer = sanitizeText(rawAnswer);
    const category = body.category ? String(body.category).trim() : "Lessons";
    const order = Number.isInteger(Number(body.order)) ? Number(body.order) : 10;
    const status: "ACTIVE" | "INACTIVE" = body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

    const faq = await db.createFaq({
      question,
      answer,
      category,
      order,
      status,
    });

    await db.addAuditLog({
      action: "FAQ_CREATED",
      actorEmail: session.user.email || "admin@nextdrive.uk",
      target: `FAQ: "${question.substring(0, 40)}${question.length > 40 ? "..." : ""}" (ID: ${faq.id})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/faqs");
    } catch {
      // Safe catch for static export environments
    }

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully.",
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
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const id = body.id ? String(body.id).trim() : "";

    if (!id) {
      return NextResponse.json(
        { success: false, error: "FAQ ID is required to update an existing record." },
        { status: 400 }
      );
    }

    const existingFaq = await db.getFaqById(id);
    if (!existingFaq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found." },
        { status: 404 }
      );
    }

    const updates: Partial<FAQItem> = {};

    if (body.question !== undefined) {
      const q = String(body.question).trim();
      if (!q) {
        return NextResponse.json(
          { success: false, error: "FAQ question is required and cannot be empty." },
          { status: 400 }
        );
      }
      updates.question = sanitizeText(q);
    }

    if (body.answer !== undefined) {
      const a = String(body.answer).trim();
      if (!a) {
        return NextResponse.json(
          { success: false, error: "FAQ answer is required and cannot be empty." },
          { status: 400 }
        );
      }
      updates.answer = sanitizeText(a);
    }

    if (body.category !== undefined) {
      const cat = String(body.category).trim();
      if (cat) updates.category = cat;
    }

    if (body.order !== undefined) {
      const parsedOrder = Number(body.order);
      if (!isNaN(parsedOrder)) {
        updates.order = parsedOrder;
      }
    }

    if (body.status !== undefined) {
      updates.status = body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    }

    // Explicitly update same record without changing ID
    const updated = await db.updateFaq(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Unable to update FAQ. Please try again." },
        { status: 500 }
      );
    }

    await db.addAuditLog({
      action: "FAQ_UPDATED",
      actorEmail: session.user.email || "admin@nextdrive.uk",
      target: `FAQ: "${updated.question.substring(0, 40)}${updated.question.length > 40 ? "..." : ""}" (ID: ${id})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/faqs");
    } catch {
      // Safe catch
    }

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully.",
      faq: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to update FAQ. Please try again." },
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
        { success: false, error: "FAQ ID parameter is required" },
        { status: 400 }
      );
    }

    const existingFaq = await db.getFaqById(id);
    const deleted = await db.deleteFaq(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "FAQ_DELETED",
      actorEmail: session.user.email || "admin@nextdrive.uk",
      target: `FAQ: "${(existingFaq?.question || id).substring(0, 40)}" (ID: ${id})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/faqs");
    } catch {
      // Safe catch
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
