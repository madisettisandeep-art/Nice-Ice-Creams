import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "nice_admin_session";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "nice-ice-creams-hmac-secret-key-local-dev-1986"
  );
}

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE || "nice1986-admin";
}

export interface AdminTokenPayload {
  role: "admin";
  actor: string;
  iat: number;
  exp: number;
}

export function createAdminSessionToken(actor = "owner@niceicecreams.com"): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    role: "admin",
    actor,
    iat: now,
    exp: now + 60 * 60 * 12, // 12 hours
  };
  const base64Payload = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): AdminTokenPayload | null {
  if (!token || !token.includes(".")) return null;
  const [base64Payload, signature] = token.split(".");
  if (!base64Payload || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(base64Payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8")
    ) as AdminTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== "admin" || payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function verifyAdminRequest(req: NextRequest): AdminTokenPayload | null {
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken) {
    const verified = verifyAdminSessionToken(cookieToken);
    if (verified) return verified;
  }
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearer = authHeader.slice(7).trim();
    return verifyAdminSessionToken(bearer);
  }
  return null;
}

