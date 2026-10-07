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

  const redirects = await db.getSEORedirects();
  return NextResponse.json({ success: true, redirects });
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
    if (!body.sourcePath || !body.destinationPath) {
      return NextResponse.json(
        { success: false, error: "Source path and destination path are required." },
        { status: 400 }
      );
    }

    const saved = await db.saveSEORedirect(body);
    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      redirect: saved,
      audit,
      message: "Redirect rule saved successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save redirect rule",
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
        { success: false, error: "Redirect ID is required." },
        { status: 400 }
      );
    }

    const deleted = await db.deleteSEORedirect(id);
    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      deleted,
      audit,
      message: "Redirect rule removed.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete redirect",
      },
      { status: 500 }
    );
  }
}
