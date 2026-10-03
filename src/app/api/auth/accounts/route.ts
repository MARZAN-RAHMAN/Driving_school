import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.getUserById(session.user.id);
  const accounts = await db.getAccountsByUserId(session.user.id);
  const hasPassword = Boolean(user?.passwordHash);

  return NextResponse.json({
    accounts,
    hasPassword,
  });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return NextResponse.json(
      { error: "Provider parameter is required" },
      { status: 400 }
    );
  }

  // Safety check: Ensure the user cannot disconnect their only login method
  const check = await db.canUserUnlinkProvider(session.user.id, provider);
  if (!check.canUnlink) {
    return NextResponse.json(
      { error: check.reason || "Cannot unlink this authentication provider." },
      { status: 400 }
    );
  }

  const success = await db.unlinkAccount(session.user.id, provider);

  if (success) {
    await db.addAuditLog({
      action: "ACCOUNT_UNLINKED",
      actorEmail: session.user.email,
      target: `Unlinked ${provider} from user ${session.user.id}`,
      ip: "127.0.0.1",
      severity: "INFO",
    });
  }

  return NextResponse.json({
    success,
    message: `${provider} successfully disconnected.`,
  });
}
