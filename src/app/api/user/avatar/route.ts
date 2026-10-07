import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Maximum upload size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Checks magic byte signatures for JPEG, PNG, and WebP images
 */
function isValidImageSignature(buffer: Buffer): { valid: boolean; ext: string } {
  if (buffer.length < 12) {
    return { valid: false, ext: "" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: "png" };
  }

  // WebP: RIFF ... WEBP
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  if (isRiff && isWebp) {
    return { valid: true, ext: "webp" };
  }

  return { valid: false, ext: "" };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Session authentication check (Admin, Instructor, Student)
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please sign in to upload a profile photo." },
        { status: 401 }
      );
    }

    const { user } = session;

    // 2. Parse form-data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // 3. File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be smaller than 5MB." },
        { status: 400 }
      );
    }

    // 4. Binary signature verification
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { valid, ext } = isValidImageSignature(buffer);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // 5. Ensure storage directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // 6. Safe unique filename
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const filename = `avatar_${Date.now()}_${uniqueId}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 7. Write file to disk
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${filename}`;

    // 8. Update database across unified user profile and role-specific models
    await db.updateUser(user.id, { avatar: publicUrl });

    if (user.role === "INSTRUCTOR") {
      const instructor = await db.getInstructorByEmail(user.email);
      if (instructor) {
        await db.updateInstructor(instructor.id, { avatar: publicUrl });
      }
    } else if (user.role === "STUDENT") {
      const student = await db.getStudentByEmail(user.email);
      if (student) {
        await db.updateStudent(student.id, { avatar: publicUrl });
      }
    }

    // 9. Audit log
    await db.addAuditLog({
      action: "USER_AVATAR_UPLOADED",
      actorEmail: user.email,
      target: `User ${user.id} (${user.name}) Avatar`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      format: ext.toUpperCase(),
    });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Unable to upload profile photo. Please try again." },
      { status: 500 }
    );
  }
}
