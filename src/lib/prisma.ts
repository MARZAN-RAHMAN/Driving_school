import { PrismaClient } from "@prisma/client";

// Global singleton pattern to prevent multiple active PrismaClient instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  provider: string;
  error?: string;
}> {
  try {
    // Attempt a lightweight raw query against the configured database
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, provider: "postgresql" };
  } catch (err) {
    return {
      connected: false,
      provider: "postgresql",
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}
