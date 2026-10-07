import { NextResponse } from "next/server";
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

  try {
    const [
      pages,
      globalSettings,
      redirects,
      keywords,
      testCentres,
      audit,
      businessSettings,
      locations,
    ] = await Promise.all([
      db.getAllPageSEO(),
      db.getGlobalSEOSettings(),
      db.getSEORedirects(),
      db.getSEOKeywords(),
      db.getLocalTestCentres(),
      db.runSEOAudit(),
      db.getBusinessSettings(),
      db.getLocations(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pages,
        globalSettings,
        redirects,
        keywords,
        testCentres,
        audit,
        businessSettings,
        locations,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load SEO data",
      },
      { status: 500 }
    );
  }
}
