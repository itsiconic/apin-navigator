/* ================================================
   POST /api/portfolio/upload — Upload images for portfolio
   Handles:
   - Banner image: updates bannerUrl
   - Project screenshot: updates projectImages[projectId]
   - Custom avatar: updates avatarUrl
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { savePortfolioConfig, getPortfolioConfig } from "@/lib/portfolio-service";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const contentType = request.headers.get("content-type") || "";

    let fileUrl = "";
    let uploadType: "banner" | "project" | "avatar" = "banner";
    let projectId = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      uploadType = (formData.get("type") as any) || "banner";
      projectId = (formData.get("projectId") as string) || "";

      if (!file) {
        throw new ValidationError({ file: ["No image file provided"] });
      }

      if (!file.type.startsWith("image/")) {
        throw new ValidationError({ file: ["File must be an image (PNG, JPG, WEBP, SVG, GIF)"] });
      }

      // Max 8MB
      if (file.size > 8 * 1024 * 1024) {
        throw new ValidationError({ file: ["Image must be smaller than 8MB"] });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const cleanName = `${uploadType}-${user.username || user.id}-${projectId ? `${projectId}-` : ""}${Date.now()}${ext}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads", "portfolio");
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, cleanName), buffer);
        fileUrl = `/uploads/portfolio/${cleanName}`;
      } catch {
        fileUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      const body = await request.json();
      uploadType = body.type || "banner";
      projectId = body.projectId || "";
      fileUrl = body.imageData || body.imageUrl;

      if (!fileUrl) {
        throw new ValidationError({ file: ["Image data is required"] });
      }
    }

    const currentConfig = getPortfolioConfig(user.username || user.id);
    let updated;

    if (uploadType === "banner") {
      updated = savePortfolioConfig(user.username || user.id, {
        bannerUrl: fileUrl,
      });
    } else if (uploadType === "project" && projectId) {
      const projectImages = { ...(currentConfig.projectImages || {}) };
      projectImages[projectId] = fileUrl;
      updated = savePortfolioConfig(user.username || user.id, {
        projectImages,
      });
    } else if (uploadType === "avatar") {
      updated = savePortfolioConfig(user.username || user.id, {
        avatarUrl: fileUrl,
      });
    } else {
      updated = currentConfig;
    }

    return Response.json(
      apiSuccess({
        message: `Portfolio ${uploadType} image uploaded successfully!`,
        url: fileUrl,
        type: uploadType,
        projectId: projectId || undefined,
        portfolioConfig: updated,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

