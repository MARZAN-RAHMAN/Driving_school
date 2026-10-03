import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, postcode } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db.getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email address already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // Hash password securely with scrypt
    const passwordHash = hashPassword(password);

    // Create User record
    const newUser = await db.createUser({
      name: name.trim(),
      email: cleanEmail,
      role: "STUDENT",
      status: "ACTIVE",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces`,
      passwordHash,
    });

    // Create matching Student record
    await db.createStudent({
      name: newUser.name,
      email: newUser.email,
      phone: phone || "+44 7700 900000",
      postcode: postcode || "M1",
      theoryStatus: "NOT_STARTED",
      hoursCompleted: 0,
      status: "ACTIVE",
    });

    // Issue session token
    await createSession(newUser);

    await db.addAuditLog({
      action: "STUDENT_SIGNUP_PASSWORD",
      actorEmail: newUser.email,
      target: `/student/signup`,
      ip: "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      redirectUrl: "/student",
      message: "Student account created successfully.",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
