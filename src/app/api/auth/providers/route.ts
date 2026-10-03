import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.getBusinessSettings();
  const authProviders = settings.authProviders || {
    google: true,
    apple: true,
    linkedin: true,
    microsoft: false,
    x: false,
  };

  return NextResponse.json({
    providers: authProviders,
  });
}
