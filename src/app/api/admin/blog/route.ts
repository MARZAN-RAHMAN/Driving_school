import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ContentStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden: Authorized session required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const articles = await db.getContent(status);

  return NextResponse.json({
    success: true,
    articles,
    total: articles.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden: Authorized session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, category, excerpt, content, status } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newArticle = await db.createContent({
      title,
      slug,
      category,
      excerpt: excerpt || title,
      content: content || excerpt || title,
      status: (status as ContentStatus) || "PUBLISHED",
      authorName: session.user.name || "NextDrive Instructor Team",
      views: 0,
      updatedAt: new Date().toISOString().split("T")[0],
    });

    await db.addAuditLog({
      action: "BLOG_ARTICLE_CREATED",
      actorEmail: session.user.email,
      target: `Article: ${newArticle.title}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden: Authorized session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, title, category, excerpt, content, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString().split("T")[0],
    };
    if (title !== undefined) {
      updates.title = title;
      updates.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    if (category !== undefined) updates.category = category;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (status !== undefined) updates.status = status;

    const updated = await db.updateContent(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.addAuditLog({
      action: "BLOG_ARTICLE_UPDATED",
      actorEmail: session.user.email,
      target: `Article ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden: Authorized session required" }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const deleted = await db.deleteContent(id);
    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.addAuditLog({
      action: "BLOG_ARTICLE_DELETED",
      actorEmail: session.user.email,
      target: `Article ID: ${id}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete article" },
      { status: 500 }
    );
  }
}
