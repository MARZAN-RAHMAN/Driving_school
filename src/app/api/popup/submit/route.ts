import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";
import { ProvisionalLicenceStatus, TransmissionType } from "@/types";

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
      formData = {},
      sourcePage = "/",
      deviceType = "desktop",
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    const campaign = await db.getPopupCampaign(true);
    const errors: Record<string, string> = {};

    // Map field keys to formData values
    const fullName = formData.name || formData.fullName || "";
    const email = formData.email || "";
    const phone = formData.phone || formData.telephone || "";
    const postcode = formData.postcode || "";
    const course = formData.course || "Beginner Driving Lessons";
    const transmission = formData.transmission || "MANUAL";
    const area = formData.area || "";
    const provisionalLicence = formData.provisionalLicence || "";
    const preferredDate = formData.preferredDate || "";
    const preferredTime = formData.preferredTime || "";
    const howDidYouHear = formData.howDidYouHear || "";
    const message = formData.message || "";

    // Validate fields according to active campaign settings
    for (const field of campaign.fields) {
      if (!field.isEnabled) continue;

      const val = formData[field.fieldKey];
      const isMissing = !val || (typeof val === "string" && !val.trim());

      if (field.isRequired && isMissing) {
        errors[field.fieldKey] = `${field.label} is required.`;
        continue;
      }

      // Format validations
      if (field.fieldKey === "email" && val) {
        if (!isValidEmail(String(val))) {
          errors.email = "Please enter a valid email address.";
        }
      }

      if (field.fieldKey === "phone" && val) {
        if (!isValidUKPhone(String(val))) {
          errors.phone = "Please enter a valid UK phone number (e.g. 07123 456789).";
        }
      }

      if (field.fieldKey === "postcode" && val) {
        if (!isValidUKPostcode(String(val))) {
          errors.postcode = "Please enter a valid UK postcode (e.g. M1 1AA).";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields correctly.",
          errors,
        },
        { status: 400 }
      );
    }

    // Build consolidated student notes
    const consolidatedNotesParts: string[] = [];
    if (message) consolidatedNotesParts.push(`Message: ${message}`);
    if (preferredDate) consolidatedNotesParts.push(`Preferred Date: ${preferredDate}`);
    if (preferredTime) consolidatedNotesParts.push(`Preferred Time: ${preferredTime}`);

    const notes = consolidatedNotesParts.join(" | ") || undefined;

    // Create inquiry record in shared DB
    const inquiry = await db.createInquiry({
      name: String(fullName).trim() || "Website Visitor",
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      postcode: String(postcode).trim().toUpperCase() || "M1 1AA",
      course: String(course).trim(),
      targetPackage: String(course).trim(),
      area: area ? String(area).trim() : undefined,
      provisionalLicence: (provisionalLicence as ProvisionalLicenceStatus) || undefined,
      howFound: howDidYouHear ? String(howDidYouHear).trim() : "Website Popup",
      transmission: (transmission as TransmissionType) || "MANUAL",
      notes,
      sourcePage: sourcePage || "/",
      utmSource: utmSource ? String(utmSource).trim() : "popup_lead_capture",
      utmMedium: utmMedium ? String(utmMedium).trim() : undefined,
      utmCampaign: utmCampaign ? String(utmCampaign).trim() : campaign.name,
      status: "NEW",
    });

    // Record telemetry event
    await db.recordPopupEvent({
      popupId: campaign.id,
      event: "popup_submitted",
      pageUrl: String(sourcePage).slice(0, 255),
      deviceType: ["desktop", "tablet", "mobile"].includes(deviceType)
        ? (deviceType as "desktop" | "tablet" | "mobile")
        : "desktop",
    });

    // Send email notification (non-blocking)
    try {
      await sendLeadNotificationEmail(inquiry);
    } catch (emailErr) {
      console.error("Non-blocking email dispatch failure:", emailErr);
    }

    // Audit log
    await db.addAuditLog({
      action: "LEAD_INQUIRY_CREATED",
      actorEmail: email ? String(email).trim().toLowerCase() : "anonymous_visitor",
      target: `Website Popup Lead: ${fullName} (${course}) from ${postcode || "Manchester"}`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      inquiry,
      afterSubmissionAction: campaign.afterSubmissionAction,
      redirectUrl: campaign.customRedirectUrl,
      successTitle: campaign.successTitle,
      successMessage: campaign.successMessage,
    });
  } catch (error) {
    console.error("Popup submission failure:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit lead.",
      },
      { status: 500 }
    );
  }
}
