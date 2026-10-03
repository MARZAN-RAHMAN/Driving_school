import { NextRequest, NextResponse } from "next/server";
import {
  SocialProvider,
  getOAuthStateFromCookie,
  clearOAuthStateCookie,
  exchangeCodeForProfile,
  verifyOAuthState,
} from "@/lib/oauth";
import { db } from "@/lib/db";
import { createSession, getSession } from "@/lib/auth";

async function handleCallback(
  request: NextRequest,
  providerParam: string,
  searchParams: URLSearchParams
) {
  const provider = providerParam.toLowerCase() as SocialProvider;
  const origin = new URL(request.url).origin;

  // 1. Verify CSRF state
  const stateQuery = searchParams.get("state");
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    await clearOAuthStateCookie();
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          errorParam === "access_denied"
            ? "Authentication was cancelled."
            : errorParam
        )}`,
        request.url
      )
    );
  }

  if (!code || !stateQuery) {
    await clearOAuthStateCookie();
    return NextResponse.redirect(
      new URL("/login?error=missing_oauth_parameters", request.url)
    );
  }

  // Validate state cryptographic signature & expiry
  const verifiedState = verifyOAuthState(stateQuery);
  const cookieState = await getOAuthStateFromCookie();

  if (!verifiedState || !cookieState || verifiedState.state !== cookieState.state) {
    await clearOAuthStateCookie();
    return NextResponse.redirect(
      new URL(
        "/login?error=Invalid+security+token.+Please+try+signing+in+again.",
        request.url
      )
    );
  }

  await clearOAuthStateCookie();

  // 2. Fetch verified identity profile from provider
  let profile;
  try {
    profile = await exchangeCodeForProfile(provider, code, origin);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Profile exchange failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, request.url)
    );
  }

  // 3. Handle Account Linking Mode
  if (cookieState.mode === "link") {
    const activeSession = await getSession();
    if (!activeSession || activeSession.user.id !== cookieState.userId) {
      return NextResponse.redirect(
        new URL("/login?error=session_expired_during_linking", request.url)
      );
    }

    try {
      await db.linkAccount(activeSession.user.id, provider, profile.id);
      await db.addAuditLog({
        action: "ACCOUNT_LINKED",
        actorEmail: activeSession.user.email,
        target: `${provider} account (${profile.email}) linked to user ${activeSession.user.id}`,
        ip: "127.0.0.1",
        severity: "INFO",
      });

      const returnPath =
        cookieState.redirectUrl ||
        (activeSession.user.role === "INSTRUCTOR"
          ? "/instructor/settings?linked=" + provider
          : "/student/settings?linked=" + provider);

      return NextResponse.redirect(new URL(returnPath, request.url));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to link account.";
      const dest =
        activeSession.user.role === "INSTRUCTOR"
          ? `/instructor/settings?error=${encodeURIComponent(msg)}`
          : `/student/settings?error=${encodeURIComponent(msg)}`;
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // 4. Handle Login / Signup Mode
  // A. Check if Account link already exists
  let user = undefined;
  const existingAccount = await db.getAccountByProvider(provider, profile.id);

  if (existingAccount) {
    user = await db.getUserById(existingAccount.userId);
  }

  // B. If not found by Account, check by Email
  if (!user && profile.email) {
    const userByEmail = await db.getUserByEmail(profile.email);
    if (userByEmail) {
      // Connect provider to existing user
      await db.linkAccount(userByEmail.id, provider, profile.id);
      user = userByEmail;
      await db.addAuditLog({
        action: "ACCOUNT_LINKED",
        actorEmail: user.email,
        target: `Existing user account linked to ${provider} (${profile.id})`,
        ip: "127.0.0.1",
        severity: "INFO",
      });
    }
  }

  // C. If user does NOT exist, create new account based on requested role
  if (!user) {
    if (cookieState.role === "INSTRUCTOR") {
      // Create pending instructor user
      user = await db.createUser({
        name: profile.name || "NextDrive Instructor",
        email: profile.email,
        role: "INSTRUCTOR",
        status: "PENDING",
        avatar: profile.avatar || "",
      });

      // Create matching Instructor record with PENDING status
      await db.createInstructor({
        name: user.name,
        badgeNumber: `ADI-${Math.floor(10000 + Math.random() * 90000)}`,
        avatar: user.avatar,
        phone: "+44 7700 900000",
        email: user.email,
        transmission: "BOTH",
        rating: 5.0,
        totalPasses: 0,
        activeStudents: 0,
        status: "PENDING",
        vehicle: "Dual-Control Training Vehicle (Inspection Pending)",
        bio: `Instructor applicant registered via ${provider.toUpperCase()}. DVSA credential verification underway.`,
        areas: ["Greater Manchester"],
        applicationDate: new Date().toISOString(),
      });

      await db.linkAccount(user.id, provider, profile.id);

      await db.addAuditLog({
        action: "INSTRUCTOR_APPLICATION_SUBMITTED",
        actorEmail: user.email,
        target: `/instructor/signup [Social: ${provider}]`,
        ip: "127.0.0.1",
        severity: "INFO",
      });
    } else {
      // Create active student user
      user = await db.createUser({
        name: profile.name || "NextDrive Student",
        email: profile.email,
        role: "STUDENT",
        status: "ACTIVE",
        avatar: profile.avatar || "",
      });

      // Create matching student record
      await db.createStudent({
        name: user.name,
        email: user.email,
        phone: "+44 7700 900000",
        postcode: "M1",
        theoryStatus: "NOT_STARTED",
        hoursCompleted: 0,
        status: "ACTIVE",
      });

      await db.linkAccount(user.id, provider, profile.id);

      await db.addAuditLog({
        action: "STUDENT_SOCIAL_SIGNUP",
        actorEmail: user.email,
        target: `/student/signup [Social: ${provider}]`,
        ip: "127.0.0.1",
        severity: "SUCCESS",
      });
    }
  }

  // Issue secure HMAC session cookie
  await createSession(user);

  await db.addAuditLog({
    action: "OAUTH_LOGIN_SUCCESS",
    actorEmail: user.email,
    target: `/login [Provider: ${provider}, Role: ${user.role}]`,
    ip: "127.0.0.1",
    severity: "SUCCESS",
  });

  // Determine redirect based on role and status
  if (user.role === "INSTRUCTOR") {
    if (user.status === "PENDING") {
      return NextResponse.redirect(
        new URL("/instructor/application-status", request.url)
      );
    }
    const dest =
      cookieState.redirectUrl && cookieState.redirectUrl.startsWith("/instructor")
        ? cookieState.redirectUrl
        : "/instructor";
    return NextResponse.redirect(new URL(dest, request.url));
  } else if (user.role === "ADMIN" || user.role === "EDITOR") {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    const dest =
      cookieState.redirectUrl && cookieState.redirectUrl.startsWith("/student")
        ? cookieState.redirectUrl
        : "/student";
    return NextResponse.redirect(new URL(dest, request.url));
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const { searchParams } = new URL(request.url);
  return handleCallback(request, provider, searchParams);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  // Apple uses form_post for OAuth callback
  const formData = await request.formData();
  const searchParams = new URLSearchParams();
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      searchParams.set(key, value);
    }
  });

  return handleCallback(request, provider, searchParams);
}
