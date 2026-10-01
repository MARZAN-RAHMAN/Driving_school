import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "PUBLISHED";

  const content = await db.getContent(status);
  return NextResponse.json({ items: content, count: content.length });
}
