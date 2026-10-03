import { NextRequest, NextResponse } from "next/server";
import {
  SocialProvider,
  signOAuthState,
  storeOAuthStateCookie,
  isProviderEnabled,
  buildAuthorizationUrl,
} from "@/lib/oauth";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await context.params;
    const lowerProvider = provider.toLowerCase() as SocialProvider;

    const validProviders: SocialProvider[] = [
      "google",
      "apple",
      "linkedin",
      "microsoft",
    ];

    if (!validProviders.includes(lowerProvider)) {
      return NextResponse.json(
        { error: `Unsupported social provider: ${provider}` },
        { status: 400 }
      );
    }

    // Check if provider is enabled in Admin settings
    const enabled = await isProviderEnabled(lowerProvider);
    if (!enabled) {
      return NextResponse.redirect(
        new URL("/login?error=provider_disabled", request.url)
      );
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role")?.toUpperCase();
    const modeParam = (searchParams.get("mode") || "login").toLowerCase() as
      | "login"
      | "signup"
      | "link";
    const redirectUrl = searchParams.get("redirectUrl") || undefined;

    // SECURITY CHECK: Strictly prohibit public social registration or login for ADMIN
    if (roleParam === "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Security Violation: Administrator accounts cannot be authenticated via public social providers.",
        },
        { status: 403 }
      );
    }

    const role: "STUDENT" | "INSTRUCTOR" =
      roleParam === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    // If linking an account, verify an existing session exists
    let userId: string | undefined;
    if (modeParam === "link") {
      const session = await getSession();
      if (!session) {
        return NextResponse.redirect(
          new URL("/login?error=session_required_for_linking", request.url)
        );
      }
      userId = session.user.id;
    }

    // Generate tamper-proof signed state token
    const { signedState } = signOAuthState({
      provider: lowerProvider,
      role,
      mode: modeParam,
      userId,
      redirectUrl,
    });

    // Store state in HTTP-only cookie for CSRF defense
    await storeOAuthStateCookie(signedState);

    const origin = new URL(request.url).origin;
    const authUrl = buildAuthorizationUrl(lowerProvider, signedState, origin);

    return NextResponse.redirect(new URL(authUrl, request.url));
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "OAuth initiation failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errMessage)}`, request.url)
    );
  }
}
