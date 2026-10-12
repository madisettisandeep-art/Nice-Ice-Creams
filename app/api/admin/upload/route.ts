import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/security/auth";

const ALLOWED_MIME = new Set(["image/webp", "image/png", "image/jpeg"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function hasValidImageMagicBytes(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return true;
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return true;
  }
  // WEBP: RIFF....WEBP
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const admin = verifyAdminRequest(req);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Only admins may upload product images." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: WebP, PNG, JPEG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds maximum allowed size of 5 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!hasValidImageMagicBytes(buffer)) {
      return NextResponse.json(
        { error: "File content does not match a valid PNG, JPEG, or WebP image." },
        { status: 400 }
      );
    }

    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
        ? "webp"
        : "jpg";
    const safeBase = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .slice(0, 40);
    const filename = `custom-${safeBase || "item"}-${Date.now()}.${ext}`;
    const targetDir = path.join(process.cwd(), "public", "menu");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, filename), buffer);

    return NextResponse.json({
      url: `/menu/${filename}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}

