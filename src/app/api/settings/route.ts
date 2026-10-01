import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await db.getBusinessSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}
