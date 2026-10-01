import { NextResponse } from "next/server";
import { authenticateCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    const authResult = await authenticateCredentials(email, password, clientIp);

    if (!authResult.success) {
      if (authResult.locked) {
        return NextResponse.json(
          {
            error: authResult.error,
            locked: true,
            retryAfter: authResult.retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(authResult.retryAfter || 300),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: authResult.error || "Authentication failed",
          remainingAttempts: authResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    const userRole = authResult.user?.role;
    const redirectUrl =
      userRole === "ADMIN" || userRole === "EDITOR"
        ? "/admin"
        : userRole === "INSTRUCTOR"
        ? "/instructor"
        : "/student";

    return NextResponse.json({
      success: true,
      user: authResult.user,
      redirectUrl,
      message: "Authentication successful",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
