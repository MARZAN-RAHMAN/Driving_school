import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await db.getBusinessSettings();
  const cmsData = {
    // Brand & Identity
    businessName: settings.businessName,
    tradingName: settings.tradingName,
    tagline: settings.tagline,
    logoBadgeText: settings.logoBadgeText,
    logoUrl: settings.logoUrl,
    phone: settings.phone,
    emergencyPhone: settings.emergencyPhone,
    email: settings.email,
    headOfficeAddress: settings.headOfficeAddress,

    // Hero Section
    heroBadge: settings.heroBadge,
    heroPassRateBadge: settings.heroPassRateBadge,
    heroHeadline: settings.heroHeadline,
    heroSubhead: settings.heroSubhead,
    heroPrimaryCtaText: settings.heroPrimaryCtaText,
    heroPrimaryCtaLink: settings.heroPrimaryCtaLink,
    heroSecondaryCtaText: settings.heroSecondaryCtaText,
    heroSecondaryCtaLink: settings.heroSecondaryCtaLink,
    heroImageUrl: settings.heroImageUrl,

    // Trust & Proof
    firstTimePassRate: settings.firstTimePassRate,
    totalPassesCount: settings.totalPassesCount,
    googleRating: settings.googleRating,
    activeFleetCount: settings.activeFleetCount,

    // Social Links
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    tiktokUrl: settings.tiktokUrl,
    youtubeUrl: settings.youtubeUrl,
    twitterUrl: settings.twitterUrl,

    // SEO
    metaTitle: settings.metaTitle,
    metaDescription: settings.metaDescription,
    metaKeywords: settings.metaKeywords,
    ogImageUrl: settings.ogImageUrl,
  };

  return NextResponse.json({
    success: true,
    cms: cmsData,
    settings,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await db.updateBusinessSettings(body);

    await db.addAuditLog({
      action: "CMS_CONTENT_UPDATED",
      actorEmail: "admin@nexuscore.dev",
      target: "Homepage CMS & SEO Configuration",
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Homepage CMS and brand settings updated successfully.",
      settings: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update CMS settings",
      },
      { status: 500 }
    );
  }
}
