/* ================================================
   GET & PUT /api/profile/social
   Manage user developer & professional social links
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const socialLinksSchema = z.object({
  github: z.string().url("Please enter a valid GitHub URL").or(z.literal("")).optional(),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").or(z.literal("")).optional(),
  portfolio: z.string().url("Please enter a valid Portfolio URL").or(z.literal("")).optional(),
  leetcode: z.string().url("Please enter a valid LeetCode / Coding Profile URL").or(z.literal("")).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const profiles = await db.socialProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    const linkMap: Record<string, string> = {
      github: "",
      linkedin: "",
      portfolio: "",
      leetcode: "",
    };

    for (const p of profiles) {
      linkMap[p.platform.toLowerCase()] = p.url;
    }

    return Response.json(apiSuccess({ profiles, linkMap }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const parsed = socialLinksSchema.parse(body);

    const platforms = [
      { platform: "github", url: parsed.github?.trim() },
      { platform: "linkedin", url: parsed.linkedin?.trim() },
      { platform: "portfolio", url: parsed.portfolio?.trim() },
      { platform: "leetcode", url: parsed.leetcode?.trim() },
    ];

    for (const item of platforms) {
      if (item.url) {
        const existing = await db.socialProfile.findFirst({
          where: { userId: user.id, platform: item.platform },
        });

        if (existing) {
          await db.socialProfile.update({
            where: { id: existing.id },
            data: { url: item.url },
          });
        } else {
          await db.socialProfile.create({
            data: {
              userId: user.id,
              platform: item.platform,
              url: item.url,
            },
          });
        }
      } else {
        // If empty URL provided, delete if existed
        const existing = await db.socialProfile.findFirst({
          where: { userId: user.id, platform: item.platform },
        });
        if (existing) {
          await db.socialProfile.delete({ where: { id: existing.id } });
        }
      }
    }

    const updated = await db.socialProfile.findMany({
      where: { userId: user.id },
    });

    return Response.json(apiSuccess(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
