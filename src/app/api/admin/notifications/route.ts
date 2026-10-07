import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export interface AdminNotificationFeedItem {
  id: string;
  rawId: string;
  type: "query" | "booking" | "pass";
  title: string;
  description: string;
  sender?: string;
  phone?: string;
  email?: string;
  course?: string;
  postcode?: string;
  message?: string;
  timestamp: string;
  createdAt: string;
  status?: string;
  isNew: boolean;
  link: string;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString.includes(" ") ? dateString.replace(" ", "T") : dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return dateString || "Recently";
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    // Verify session - allow admin or editor
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return NextResponse.json(
        { error: "Forbidden: Authorized session required", notifications: [], stats: { newQueriesCount: 0 } },
        { status: 403 }
      );
    }

    const [inquiries, bookings, students] = await Promise.all([
      db.getInquiries(),
      db.getBookings(),
      db.getStudents(),
    ]);

    const notifications: AdminNotificationFeedItem[] = [];

    // 1. Inquiries / Student Queries (high priority)
    inquiries.slice(0, 15).forEach((inq) => {
      const isNew = inq.status === "NEW";
      const snippet = inq.notes || inq.message;
      const cleanSnippet = snippet ? ` — "${snippet.slice(0, 65)}${snippet.length > 65 ? "..." : ""}"` : "";

      notifications.push({
        id: `query-${inq.id}`,
        rawId: inq.id,
        type: "query",
        title: isNew ? `New Enquiry: ${inq.name}` : `Enquiry: ${inq.name}`,
        description: `${inq.targetPackage || inq.course || "Driving Lesson"}${inq.postcode ? ` • ${inq.postcode}` : ""}${cleanSnippet}`,
        sender: inq.name,
        phone: inq.phone,
        email: inq.email,
        course: inq.targetPackage || inq.course,
        postcode: inq.postcode,
        message: snippet || undefined,
        timestamp: formatRelativeTime(inq.createdAt),
        createdAt: inq.createdAt || new Date().toISOString(),
        status: inq.status,
        isNew,
        link: `/admin/enquiries?id=${inq.id}`,
      });
    });

    // 2. Recent Bookings
    bookings.slice(0, 6).forEach((b) => {
      notifications.push({
        id: `booking-${b.id}`,
        rawId: b.id,
        type: "booking",
        title: `Dispatch: ${b.studentName}`,
        description: `${b.lessonTitle} with ${b.instructorName} • ${b.pickupLocation}`,
        timestamp: formatRelativeTime(b.dateTime),
        createdAt: b.dateTime || new Date().toISOString(),
        status: b.status,
        isNew: b.status === "CONFIRMED" || b.status === "IN_PROGRESS",
        link: `/admin/bookings`,
      });
    });

    // 3. Recent Practical Passes
    students
      .filter((s) => s.status === "PASSED")
      .slice(0, 4)
      .forEach((s) => {
        notifications.push({
          id: `pass-${s.id}`,
          rawId: s.id,
          type: "pass",
          title: `Pass: ${s.name} passed practical test!`,
          description: `${s.passDate || "Recently passed"} • Practical Driving Test verified`,
          timestamp: s.passDate || "Recently",
          createdAt: s.passDate || new Date().toISOString(),
          status: "PASSED",
          isNew: false,
          link: `/admin/customers`,
        });
      });

    // Sort newest first
    notifications.sort((a, b) => {
      // Prioritize brand new queries at top
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const newQueriesCount = inquiries.filter((i) => i.status === "NEW").length;

    return NextResponse.json({
      success: true,
      notifications,
      stats: {
        newQueriesCount,
        totalInquiries: inquiries.length,
        totalNotifications: notifications.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load notifications",
        notifications: [],
        stats: { newQueriesCount: 0 },
      },
      { status: 500 }
    );
  }
}

// POST endpoint to simulate a new query or mark query as viewed
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return NextResponse.json(
        { error: "Forbidden: Authorized session required" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { action, queryId } = body;

    if (action === "simulate-query") {
      const names = [
        "Aiden Scott",
        "Zoe Edwards",
        "Liam Cooper",
        "Emma Wilson",
        "Oliver Wright",
      ];
      const postcodes = ["M14 5TP", "M20 2AB", "M33 4CD", "M3 2EQ", "SK4 1BG"];
      const courses = [
        "Introductory 2-Hour Assessment",
        "20-Hour Intensive Fast-Pass",
        "10-Hour Starter Block",
        "Pass Plus & Motorway",
      ];
      const randomIdx = Math.floor(Math.random() * names.length);
      const chosenName = names[randomIdx];
      const chosenPostcode = postcodes[randomIdx];
      const chosenCourse = courses[randomIdx % courses.length];

      const newInquiry = await db.createInquiry({
        name: chosenName,
        email: `${chosenName.toLowerCase().replace(" ", ".")}@example.co.uk`,
        phone: "+44 7700 900" + Math.floor(100 + Math.random() * 900),
        postcode: chosenPostcode,
        targetPackage: chosenCourse,
        course: chosenCourse,
        area: "Manchester Greater Region",
        transmission: Math.random() > 0.5 ? "MANUAL" : "AUTOMATIC",
        notes: "Requesting lesson availability starting next Monday. Have passed theory test.",
        status: "NEW",
      });

      return NextResponse.json({
        success: true,
        message: `Simulated new inquiry from ${chosenName}`,
        inquiry: newInquiry,
      });
    }

    if (action === "mark-viewed" && queryId) {
      const updated = await db.updateInquiry(queryId, { status: "CONTACTED" });
      return NextResponse.json({
        success: true,
        inquiry: updated,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
