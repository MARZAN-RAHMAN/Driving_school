import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || undefined;
  const role = searchParams.get("role") || undefined;

  const users = await db.getUsers(q, role);
  return NextResponse.json({ users, total: users.length });
}
