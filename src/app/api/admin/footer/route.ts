import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FooterSettings } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Validates and sanitizes a URL string to prevent javascript:, data:, or other malicious schemes
 */
function sanitizeUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "#";
  }
  return trimmed;
}

export async function GET() {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const draft = await db.getFooterSettings(false);
    const published = await db.getFooterSettings(true);

    return NextResponse.json({
      success: true,
      draft,
      published,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const updates: Partial<FooterSettings> = await req.json();

    // Sanitize any URLs in columns, links, social links, legal links, and developer credit
    if (updates.developerUrl) {
      updates.developerUrl = sanitizeUrl(updates.developerUrl);
    }

    if (updates.columns) {
      updates.columns = updates.columns.map((col) => ({
        ...col,
        links: (col.links || []).map((link) => ({
          ...link,
          url: sanitizeUrl(link.url),
        })),
      }));
    }

    if (updates.socialLinks) {
      updates.socialLinks = updates.socialLinks.map((s) => ({
        ...s,
        url: sanitizeUrl(s.url),
      }));
    }

    if (updates.legalLinks) {
      updates.legalLinks = updates.legalLinks.map((l) => ({
        ...l,
        url: sanitizeUrl(l.url),
      }));
    }

    const updated = await db.updateFooterSettings(updates);

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update footer draft configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin or Editor session required" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { action, isEnabled } = body;

    if (action === "publish") {
      const published = await db.publishFooterSettings();

      try {
        revalidatePath("/");
        revalidatePath("/contact");
      } catch {
        // Safe catch for static generation environments
      }

      return NextResponse.json({
        success: true,
        message: "Footer changes successfully published to the live website.",
        settings: published,
      });
    }

    if (action === "toggle") {
      await db.updateFooterSettings({ isEnabled: Boolean(isEnabled) });
      const published = await db.publishFooterSettings();

      try {
        revalidatePath("/");
        revalidatePath("/contact");
      } catch {
        // Safe catch
      }

      return NextResponse.json({
        success: true,
        message: `Public footer ${published.isEnabled ? "enabled" : "disabled"}.`,
        settings: published,
      });
    }

    if (action === "reset") {
      const reset = await db.resetFooterSettings();
      return NextResponse.json({
        success: true,
        message: "Footer settings reset to default published configuration.",
        settings: reset,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process footer action" },
      { status: 500 }
    );
  }
}
