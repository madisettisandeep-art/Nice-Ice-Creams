import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, isSupabaseConfigured } from "@/lib/db/store";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminPasscode,
  verifyAdminRequest,
} from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const auditLogs = await getAuditLogs();
  return NextResponse.json({
    authenticated: true,
    actor: admin.actor,
    role: admin.role,
    supabaseConfigured: isSupabaseConfigured(),
    auditLogs,
  });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local-client";

  const rl = checkRateLimit(`admin-login:${ip}`, 8, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Please wait ${rl.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const submittedPasscode = String(body?.passcode || "");
    const actor = String(body?.email || "owner@niceicecreams.com").slice(0, 80);
    const expectedPasscode = getAdminPasscode();

    const a = Buffer.from(submittedPasscode);
    const b = Buffer.from(expectedPasscode);
    const isMatch = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Access denied." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(actor);
    const res = NextResponse.json({
      authenticated: true,
      actor,
      role: "admin",
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid login request." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}

