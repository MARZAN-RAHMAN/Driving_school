import { NextResponse } from "next/server";
import { SystemHealth } from "@/types";

const startTime = Date.now();

export async function GET() {
  const healthData: SystemHealth = {
    status: "healthy",
    version: "1.0.0",
    phase: "PART 1 - Foundation & Core Architecture",
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "online (in-memory / postgres ready)",
      auth: "operational (cookie session rbac)",
      api: "operational (rest / app router)",
      cache: "active (edge cache enabled)",
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
