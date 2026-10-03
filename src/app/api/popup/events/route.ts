import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PopupAnalyticsEvent } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { popupId = "popup_main", event, pageUrl = "/", deviceType = "desktop" } = body;

    const validEvents: PopupAnalyticsEvent["event"][] = [
      "popup_impression",
      "popup_opened",
      "popup_dismissed",
      "popup_form_started",
      "popup_form_field_completed",
      "popup_submitted",
      "popup_error",
    ];

    if (!validEvents.includes(event)) {
      return NextResponse.json(
        { success: false, error: "Invalid event type" },
        { status: 400 }
      );
    }

    const recordedEvent = await db.recordPopupEvent({
      popupId: String(popupId),
      event,
      pageUrl: String(pageUrl).slice(0, 255),
      deviceType: ["desktop", "tablet", "mobile"].includes(deviceType)
        ? (deviceType as "desktop" | "tablet" | "mobile")
        : "desktop",
    });

    return NextResponse.json({
      success: true,
      event: recordedEvent,
    });
  } catch (error) {
    console.error("Popup analytics recording error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record event" },
      { status: 500 }
    );
  }
}
