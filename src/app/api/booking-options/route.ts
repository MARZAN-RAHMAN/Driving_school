import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [lessonPackages, locations] = await Promise.all([
      db.getLessonPackages(),
      db.getLocations(true),
    ]);

    const courses = lessonPackages.map((pkg) => ({
      id: pkg.id,
      title: pkg.title,
      price: pkg.price,
      durationHours: pkg.durationHours,
      badge: pkg.badge,
    }));

    const areas = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      postcodes: loc.postcodes,
      boroughs: loc.boroughs,
    }));

    const provisionalOptions = ["Yes", "No", "Applying soon"];

    const howFoundOptions = [
      "Google",
      "Google Maps",
      "Facebook",
      "Instagram",
      "TikTok",
      "Recommendation",
      "Friend/Family",
      "Other",
    ];

    return NextResponse.json({
      success: true,
      courses,
      areas,
      provisionalOptions,
      howFoundOptions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load booking options.",
      },
      { status: 500 }
    );
  }
}
