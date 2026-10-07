import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageSEO } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  const pages = await db.getAllPageSEO();
  return NextResponse.json({ success: true, pages });
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
    const { page, oldUrlPath, createRedirect } = body as {
      page: PageSEO;
      oldUrlPath?: string;
      createRedirect?: boolean;
    };

    if (!page || !page.urlPath) {
      return NextResponse.json(
        { success: false, error: "Page data and urlPath are required." },
        { status: 400 }
      );
    }

    // Safety lock: Private authenticated dashboards must NEVER be set to index
    const cleanUrl = page.urlPath.toLowerCase().trim();
    const isPrivate =
      cleanUrl.startsWith("/admin") ||
      cleanUrl.startsWith("/instructor") ||
      cleanUrl.startsWith("/student") ||
      cleanUrl.startsWith("/api") ||
      cleanUrl.startsWith("/auth");

    if (isPrivate && page.indexStatus === "INDEX") {
      return NextResponse.json(
        {
          success: false,
          error: "Security Policy: Private authenticated areas cannot be made indexable to search engines.",
        },
        { status: 400 }
      );
    }

    // Save page SEO
    const saved = await db.savePageSEO(page);

    // If URL changed and createRedirect was checked, create 301 redirect
    if (oldUrlPath && oldUrlPath !== page.urlPath && createRedirect) {
      await db.saveSEORedirect({
        sourcePath: oldUrlPath,
        destinationPath: page.urlPath,
        statusCode: 301,
        isActive: true,
        notes: `Automatic 301 created when slug changed from ${oldUrlPath} to ${page.urlPath}`,
      });
    }

    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      page: saved,
      audit,
      message: "Page SEO configuration updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update page SEO",
      },
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deletePageSEO(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Page not found or cannot be deleted" },
        { status: 404 }
      );
    }

    const audit = await db.runSEOAudit();
    return NextResponse.json({ success: true, audit, message: "Page removed from SEO directory." });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete page SEO",
      },
      { status: 500 }
    );
  }
}
