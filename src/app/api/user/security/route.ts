import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  const dbUser = (await db.getUserById(user.id)) || (await db.getUserByEmail(user.email));
  const accounts = await db.getAccountsByUserId(user.id);
  const hasPassword = Boolean(dbUser?.passwordHash);

  return NextResponse.json({
    success: true,
    email: user.email,
    hasPassword,
    accounts,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  const dbUser = (await db.getUserById(user.id)) || (await db.getUserByEmail(user.email));

  if (!dbUser) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, error: "New password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New passwords do not match." },
        { status: 400 }
      );
    }

    // Verify current password if user already has a local password
    if (dbUser.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required." },
          { status: 400 }
        );
      }

      const isValid = verifyPassword(currentPassword, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Incorrect current password." },
          { status: 400 }
        );
      }
    }

    // Hash new password and update user
    const newPasswordHash = hashPassword(newPassword);
    await db.updateUser(dbUser.id, { passwordHash: newPasswordHash });

    // Audit log
    await db.addAuditLog({
      action: "USER_PASSWORD_CHANGED",
      actorEmail: dbUser.email,
      target: `User ${dbUser.id} (${dbUser.name}) Security Credentials`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Password update failed:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while updating password." },
      { status: 500 }
    );
  }
}
