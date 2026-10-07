import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  const dbUser = (await db.getUserById(user.id)) || (await db.getUserByEmail(user.email)) || user;

  let roleData: unknown = null;
  if (user.role === "INSTRUCTOR") {
    roleData = (await db.getInstructorByEmail(user.email)) || null;
  } else if (user.role === "STUDENT") {
    roleData = (await db.getStudentByEmail(user.email)) || null;
  }

  const accounts = await db.getAccountsByUserId(dbUser.id);
  const hasPassword = Boolean(dbUser.passwordHash);

  return NextResponse.json({
    success: true,
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      status: dbUser.status,
      avatar: dbUser.avatar,
      phone: dbUser.phone || "",
      createdAt: dbUser.createdAt,
      lastLogin: dbUser.lastLogin,
    },
    roleData,
    accounts,
    hasPassword,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Derive identity strictly from server session
  const { user } = session;

  try {
    const body = await req.json();
    const { name, phone, avatar } = body;

    const updates: Record<string, unknown> = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return NextResponse.json(
          { success: false, error: "Name cannot be empty." },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    if (phone !== undefined) {
      updates.phone = String(phone).trim();
    }

    if (avatar !== undefined) {
      updates.avatar = String(avatar).trim();
    }

    const updatedUser = await db.updateUser(user.id, updates);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User account could not be found." },
        { status: 404 }
      );
    }

    // Role-specific profile synchronization
    if (user.role === "INSTRUCTOR") {
      const instructor = await db.getInstructorByEmail(user.email);
      if (instructor) {
        const instUpdates: Record<string, unknown> = {};
        if (updates.name) instUpdates.name = updates.name;
        if (updates.phone) instUpdates.phone = updates.phone;
        if (updates.avatar) instUpdates.avatar = updates.avatar;
        if (body.bio !== undefined) instUpdates.bio = String(body.bio);
        if (Array.isArray(body.areas)) instUpdates.areas = body.areas;

        await db.updateInstructor(instructor.id, instUpdates);
      }
    } else if (user.role === "STUDENT") {
      const student = await db.getStudentByEmail(user.email);
      if (student) {
        const studentUpdates: Record<string, unknown> = {};
        if (updates.name) studentUpdates.name = updates.name;
        if (updates.phone) studentUpdates.phone = updates.phone;
        if (updates.avatar) studentUpdates.avatar = updates.avatar;
        if (body.postcode !== undefined) studentUpdates.postcode = String(body.postcode);
        if (body.provisionalLicenseNumber !== undefined) {
          studentUpdates.provisionalLicenseNumber = String(body.provisionalLicenseNumber);
        }

        await db.updateStudent(student.id, studentUpdates);
      }
    }

    // Audit log
    await db.addAuditLog({
      action: "USER_PROFILE_UPDATED",
      actorEmail: user.email,
      target: `User ${user.id} (${updatedUser.name}) Profile`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone || "",
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
      },
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while updating profile." },
      { status: 500 }
    );
  }
}
