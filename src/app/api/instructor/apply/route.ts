import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/security";
import { TransmissionType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      transmission,
      yearsExperience,
      badgeNumber,
      vehicle,
      areas,
      bio,
    } = body;

    if (!name || !email || !phone || !badgeNumber) {
      return NextResponse.json(
        {
          error:
            "Full name, email address, phone number, and ADI badge number are required.",
        },
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
            "An account with this email address already exists. Please sign in or use a different email.",
        },
        { status: 409 }
      );
    }

    const passwordHash = password ? hashPassword(password) : undefined;

    // 1. Create Instructor User in PENDING status
    const newUser = await db.createUser({
      name: name.trim(),
      email: cleanEmail,
      role: "INSTRUCTOR",
      status: "PENDING",
      avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces`,
      passwordHash,
    });

    // Parse areas array
    const parsedAreas = Array.isArray(areas)
      ? areas
      : typeof areas === "string"
      ? areas.split(",").map((a: string) => a.trim()).filter(Boolean)
      : ["Greater Manchester"];

    // 2. Create Instructor Record in PENDING status
    await db.createInstructor({
      name: newUser.name,
      badgeNumber: badgeNumber.trim().toUpperCase(),
      avatar: newUser.avatar,
      phone: phone.trim(),
      email: newUser.email,
      transmission: (transmission as TransmissionType | "BOTH") || "BOTH",
      rating: 5.0,
      totalPasses: 0,
      activeStudents: 0,
      status: "PENDING",
      vehicle: vehicle?.trim() || "Dual-Control Vehicle",
      bio: bio?.trim() || "DVSA Approved Driving Instructor applicant.",
      areas: parsedAreas.length > 0 ? parsedAreas : ["Manchester Central"],
      applicationDate: new Date().toISOString(),
      yearsExperience: Number(yearsExperience) || 1,
    });

    // Issue session token
    await createSession(newUser);

    await db.addAuditLog({
      action: "INSTRUCTOR_APPLICATION_SUBMITTED",
      actorEmail: newUser.email,
      target: `/instructor/signup [ADI: ${badgeNumber}]`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      redirectUrl: "/instructor/application-status",
      message: "Instructor application received successfully.",
    });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Instructor application failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
