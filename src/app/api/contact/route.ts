import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TransmissionType, ProvisionalLicenceStatus } from "@/types";
import { sendLeadNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUKPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/[\s\-()]/g, "");
  return /^(?:(?:\+44)|(?:0044)|0)[1-9]\d{8,9}$/.test(cleaned);
}

function isValidUKPostcode(postcode: string): boolean {
  const cleaned = postcode.trim().toUpperCase();
  return /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      postcode,
      course,
      targetPackage,
      area,
      provisionalLicence,
      howFound,
      notes,
      message,
      transmission,
      sourcePage,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    if (!phone || typeof phone !== "string" || !isValidUKPhone(phone)) {
      errors.phone = "Please enter a valid UK telephone number (e.g., 07123 456789 or +44 7123 456789).";
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!postcode || typeof postcode !== "string" || !isValidUKPostcode(postcode)) {
      errors.postcode = "Please enter a valid UK postcode (e.g., SW1A 1AA, N1 2XY, E14 9QA).";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the errors in the form.",
          errors,
        },
        { status: 400 }
      );
    }

    const selectedCourse = (course || targetPackage || "Beginner Driving Lessons").trim();
    const studentNotes = (message || notes || "").trim();

    const inquiry = await db.createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      postcode: postcode.trim().toUpperCase(),
      course: selectedCourse,
      targetPackage: selectedCourse,
      area: area ? String(area).trim() : undefined,
      provisionalLicence: (provisionalLicence as ProvisionalLicenceStatus) || undefined,
      howFound: howFound ? String(howFound).trim() : undefined,
      transmission: (transmission as TransmissionType) || "MANUAL",
      notes: studentNotes,
      sourcePage: sourcePage || req.headers.get("referer") || "/",
      utmSource: utmSource ? String(utmSource).trim() : undefined,
      utmMedium: utmMedium ? String(utmMedium).trim() : undefined,
      utmCampaign: utmCampaign ? String(utmCampaign).trim() : undefined,
      status: "NEW",
    });

    // Send email notification to school admins (never blocks user submission)
    try {
      await sendLeadNotificationEmail(inquiry);
    } catch (emailErr) {
      console.error("Non-fatal email dispatch error:", emailErr);
    }

    // Audit log
    await db.addAuditLog({
      action: "LEAD_INQUIRY_CREATED",
      actorEmail: email.trim().toLowerCase(),
      target: `New driving lesson lead submitted by ${name.trim()} (${selectedCourse}) from ${postcode.trim().toUpperCase()}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Your lesson enquiry has been received. One of our team members will contact you shortly.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit lesson enquiry.",
      },
      { status: 500 }
    );
  }
}
