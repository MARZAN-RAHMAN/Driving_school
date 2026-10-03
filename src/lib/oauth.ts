import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SECRET =
  process.env.SESSION_SECRET ||
  "nexuscore_production_secret_key_change_in_prod_89237489";

export const OAUTH_STATE_COOKIE = "nextdrive_oauth_state";

export type SocialProvider = "google" | "apple" | "linkedin" | "microsoft";

export interface OAuthStatePayload {
  state: string;
  provider: SocialProvider;
  role: "STUDENT" | "INSTRUCTOR";
  mode: "login" | "signup" | "link";
  userId?: string;
  redirectUrl?: string;
  exp: number;
}

export interface SocialProfile {
  provider: SocialProvider;
  id: string; // providerAccountId
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
}

export function signOAuthState(payload: Omit<OAuthStatePayload, "exp" | "state">): {
  signedState: string;
  rawState: string;
} {
  const rawState = crypto.randomBytes(24).toString("hex");
  const fullPayload: OAuthStatePayload = {
    ...payload,
    state: rawState,
    exp: Math.floor(Date.now() / 1000) + 600, // 10 minutes expiry
  };

  const jsonStr = JSON.stringify(fullPayload);
  const base64Payload = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Payload)
    .digest("base64url");

  return {
    signedState: `${base64Payload}.${signature}`,
    rawState,
  };
}

export function verifyOAuthState(signedState: string): OAuthStatePayload | null {
  try {
    const parts = signedState.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(base64Payload)
      .digest("base64url");

    if (
      Buffer.from(signature).length !== Buffer.from(expectedSig).length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
    ) {
      return null;
    }

    const payload: OAuthStatePayload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8")
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function storeOAuthStateCookie(signedState: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, signedState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
}

export async function getOAuthStateFromCookie(): Promise<OAuthStatePayload | null> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
    if (!val) return null;
    return verifyOAuthState(val);
  } catch {
    return null;
  }
}

export async function clearOAuthStateCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isProviderEnabled(provider: SocialProvider): Promise<boolean> {
  const settings = await db.getBusinessSettings();
  const authProviders = settings.authProviders || {
    google: true,
    apple: true,
    linkedin: true,
    microsoft: false,
    x: false,
  };
  return Boolean(authProviders[provider]);
}

export function getProviderConfig(provider: SocialProvider) {
  switch (provider) {
    case "google":
      return {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
        scope: "openid profile email",
      };
    case "apple":
      return {
        clientId: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
        authUrl: "https://appleid.apple.com/auth/authorize",
        tokenUrl: "https://appleid.apple.com/auth/token",
        scope: "name email",
      };
    case "linkedin":
      return {
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        authUrl: "https://www.linkedin.com/oauth/v2/authorization",
        tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        userInfoUrl: "https://api.linkedin.com/v2/userinfo",
        scope: "openid profile email",
      };
    case "microsoft":
      return {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        userInfoUrl: "https://graph.microsoft.com/oidc/userinfo",
        scope: "openid profile email",
      };
  }
}

export function buildAuthorizationUrl(
  provider: SocialProvider,
  signedState: string,
  origin: string
): string {
  const config = getProviderConfig(provider);
  const callbackUrl = `${origin}/api/auth/callback/${provider}`;

  // If real OAuth credentials are not provided, or in test environment:
  // seamlessly direct to the interactive NextDrive OAuth simulator
  if (!config.clientId || !config.clientSecret) {
    return `/auth/mock-oauth?provider=${provider}&state=${encodeURIComponent(
      signedState
    )}`;
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: config.scope,
    state: signedState,
  });

  if (provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "select_account");
  } else if (provider === "apple") {
    params.set("response_mode", "form_post");
  }

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForProfile(
  provider: SocialProvider,
  code: string,
  origin: string
): Promise<SocialProfile> {
  // Check for Mock OAuth Code generated by dev/simulator consent screen
  if (code.startsWith("mock_code_")) {
    try {
      const decodedPayload = Buffer.from(
        code.replace("mock_code_", ""),
        "base64url"
      ).toString("utf-8");
      const mockData = JSON.parse(decodedPayload);

      return {
        provider,
        id: mockData.id || `mock_${provider}_${Date.now()}`,
        email: mockData.email,
        name: mockData.name,
        avatar:
          mockData.avatar ||
          `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces`,
        emailVerified: true,
      };
    } catch {
      throw new Error("Invalid mock authorization code.");
    }
  }

  const config = getProviderConfig(provider);
  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      `${provider} OAuth is not configured with production credentials.`
    );
  }

  const callbackUrl = `${origin}/api/auth/callback/${provider}`;

  // Real OAuth token exchange
  const tokenParams = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: callbackUrl,
  });

  const tokenRes = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenParams.toString(),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Token exchange failed with ${provider}: ${errorText}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (config.userInfoUrl && accessToken) {
    const userRes = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user profile from ${provider}`);
    }

    const userData = await userRes.json();

    return {
      provider,
      id: userData.sub || userData.id,
      email: userData.email,
      name: userData.name || `${userData.given_name || ""} ${userData.family_name || ""}`.trim() || userData.email.split("@")[0],
      avatar: userData.picture || userData.avatar_url,
      emailVerified: Boolean(userData.email_verified ?? true),
    };
  }

  throw new Error(`Unsupported token response from ${provider}`);
}
