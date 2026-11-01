/* ================================================
   POST /api/profile/photo — Upload profile picture
   DELETE /api/profile/photo — Remove profile picture
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    let photoUrl = "";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        throw new ValidationError({ file: ["No image file provided"] });
      }

      if (!file.type.startsWith("image/")) {
        throw new ValidationError({ file: ["File must be an image (PNG, JPG, WEBP, SVG)"] });
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new ValidationError({ file: ["Image must be smaller than 5MB"] });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : ".jpg");
      const filename = `avatar-${user.id}-${Date.now()}${ext}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        photoUrl = `/uploads/avatars/${filename}`;
      } catch {
        // Fallback to base64 data URI if filesystem is restricted or read-only
        photoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      const body = await request.json();
      if (!body.photoData && !body.photoUrl) {
        throw new ValidationError({ photo: ["Image data is required"] });
      }
      photoUrl = body.photoData || body.photoUrl;
    }

    const updated = await db.profile.upsert({
      where: { userId: user.id },
      update: { profilePhotoUrl: photoUrl },
      create: { userId: user.id, profilePhotoUrl: photoUrl },
    });

    return Response.json(
      apiSuccess({
        message: "Profile picture updated successfully",
        profilePhotoUrl: updated.profilePhotoUrl,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    await db.profile.update({
      where: { userId: user.id },
      data: { profilePhotoUrl: null },
    });

    return Response.json(
      apiSuccess({
        message: "Profile picture removed successfully",
        profilePhotoUrl: null,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

