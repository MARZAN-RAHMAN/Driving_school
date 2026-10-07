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

  const testCentres = await db.getLocalTestCentres();
  return NextResponse.json({ success: true, testCentres });
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
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Test centre name and slug are required." },
        { status: 400 }
      );
    }

    const saved = await db.saveLocalTestCentre(body);
    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      testCentre: saved,
      audit,
      message: "Test centre updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save test centre",
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
        { success: false, error: "Test centre ID is required" },
        { status: 400 }
      );
    }

    await db.deleteLocalTestCentre(id);
    const audit = await db.runSEOAudit();

    return NextResponse.json({
      success: true,
      audit,
      message: "Test centre removed.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete test centre",
      },
      { status: 500 }
    );
  }
}
