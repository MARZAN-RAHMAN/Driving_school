import crypto from "crypto";
import { UserRole } from "@/types";

const SECRET =
  process.env.SESSION_SECRET ||
  "nexuscore_production_secret_key_change_in_prod_89237489";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
  jti: string;
}

// ==========================================
// 1. Cryptographic Password Hashing (scrypt)
// ==========================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, keyBuffer.length);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// ==========================================
// 2. Tamper-Proof Cryptographic Tokens (HMAC-SHA256)
// ==========================================

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf-8");
}

export function signSessionToken(
  user: { id: string; email: string; name: string; role: UserRole },
  expiresInSeconds = 7 * 24 * 60 * 60
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInSeconds,
    jti: crypto.randomBytes(12).toString("hex"),
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): {
  valid: boolean;
  payload?: SessionPayload;
  error?: string;
} {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Missing token" };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Malformed token structure" };
    }

    const [encodedPayload, signature] = parts;

    // Verify HMAC-SHA256 signature in constant time
    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(encodedPayload)
      .digest("base64url");

    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(signature);

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      return { valid: false, error: "Invalid cryptographic signature" };
    }

    // Decode and check expiration
    const payloadText = base64UrlDecode(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadText);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Session token expired" };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Verification failed" };
  }
}

// ==========================================
// 3. Brute Force Protection & Rate Limiting
// ==========================================

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 300; // 5 minutes
const LOCKOUT_SECONDS = 300; // 5 minutes lockout

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: record.lockedUntil - now,
    };
  }

  // Check if window has expired
  if (now - record.firstAttemptAt > WINDOW_SECONDS) {
    loginAttempts.delete(identifier);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_SECONDS;
    record.lockedUntil = lockedUntil;
    return {
      allowed: false,
      remaining: 0,
      retryAfter: LOCKOUT_SECONDS,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, MAX_ATTEMPTS - record.attempts),
  };
}

export function recordFailedAttempt(identifier: string): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const record = loginAttempts.get(identifier);

  if (!record || now - record.firstAttemptAt > WINDOW_SECONDS) {
    loginAttempts.set(identifier, { attempts: 1, firstAttemptAt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_SECONDS;
    return { allowed: false, remaining: 0, retryAfter: LOCKOUT_SECONDS };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.attempts };
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}
