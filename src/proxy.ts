import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET =
  process.env.SESSION_SECRET ||
  "nexuscore_production_secret_key_change_in_prod_89237489";

async function verifyHmacEdge(
  encodedPayload: string,
  signature: string
): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    let b64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(encodedPayload)
    );
  } catch {
    return false;
  }
}

function parsePayload(encodedPayload: string) {
  try {
    let b64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("nexus_session_token")?.value;

    // 1. Check if token exists
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Cryptographic Signed Token Verification
    if (sessionToken.includes(".")) {
      const [encodedPayload, signature] = sessionToken.split(".");
      const isValidSignature = await verifyHmacEdge(encodedPayload, signature);

      if (!isValidSignature) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "invalid_session");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      const payload = parsePayload(encodedPayload);
      if (!payload) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "malformed_session");
        return NextResponse.redirect(loginUrl);
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      // Role & Permission Checks
      const role = payload.role;

      if (role === "ADMIN") {
        return NextResponse.next();
      }

      if (role === "EDITOR") {
        // Editor can access dashboard overview and content management
        if (pathname === "/admin" || pathname.startsWith("/admin/content")) {
          return NextResponse.next();
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "insufficient_permissions");
        return NextResponse.redirect(loginUrl);
      }

      if (role === "INSTRUCTOR") {
        // Instructor cannot access /admin -> redirect to instructor dashboard
        const instructorUrl = new URL("/instructor", request.url);
        instructorUrl.searchParams.set("error", "unauthorized_admin_access");
        return NextResponse.redirect(instructorUrl);
      }

      // STUDENT role is completely barred from /admin -> redirect to student dashboard with warning
      const studentUrl = new URL("/student", request.url);
      studentUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(studentUrl);
    }

    // 3. Fallback for legacy tokens
    if (!sessionToken.includes("_admin_")) {
      const studentUrl = new URL("/student", request.url);
      studentUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(studentUrl);
    }
  }

  // Protect all /instructor routes
  if (pathname.startsWith("/instructor")) {
    const sessionToken = request.cookies.get("nexus_session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionToken.includes(".")) {
      const [encodedPayload, signature] = sessionToken.split(".");
      const isValidSignature = await verifyHmacEdge(encodedPayload, signature);

      if (!isValidSignature) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "invalid_session");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      const payload = parsePayload(encodedPayload);
      if (!payload) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "malformed_session");
        return NextResponse.redirect(loginUrl);
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      const role = payload.role;

      // INSTRUCTOR and ADMIN can access instructor dashboard
      if (role === "INSTRUCTOR" || role === "ADMIN") {
        return NextResponse.next();
      }

      // Students attempting to access instructor routes get redirected to their student dashboard
      if (role === "STUDENT") {
        const studentUrl = new URL("/student", request.url);
        studentUrl.searchParams.set("error", "unauthorized_instructor_access");
        return NextResponse.redirect(studentUrl);
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "insufficient_permissions");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all /student routes
  if (pathname.startsWith("/student")) {
    const sessionToken = request.cookies.get("nexus_session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionToken.includes(".")) {
      const [encodedPayload, signature] = sessionToken.split(".");
      const isValidSignature = await verifyHmacEdge(encodedPayload, signature);

      if (!isValidSignature) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "invalid_session");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      const payload = parsePayload(encodedPayload);
      if (!payload) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "malformed_session");
        return NextResponse.redirect(loginUrl);
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("nexus_session_token");
        return response;
      }

      const role = payload.role;

      // STUDENT and ADMIN can access student portal
      if (role === "STUDENT" || role === "ADMIN") {
        return NextResponse.next();
      }

      // Instructors attempting to access student routes get redirected to instructor dashboard
      if (role === "INSTRUCTOR") {
        const instructorUrl = new URL("/instructor", request.url);
        instructorUrl.searchParams.set("error", "unauthorized_student_access");
        return NextResponse.redirect(instructorUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/student/:path*"],
};

export default proxy;
