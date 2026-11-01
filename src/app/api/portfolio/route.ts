/* ================================================
   GET /api/portfolio — Get portfolio data & customization
   POST /api/portfolio — Update portfolio configuration
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import {
  getPortfolioConfig,
  savePortfolioConfig,
} from "@/lib/portfolio-service";
import {
  PortfolioTemplateId,
  TEMPLATE_REGISTRY,
} from "@/lib/portfolio-types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const [fullUser, skills, projects] = await Promise.all([
      db.user
        .findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                preferredName: true,
                profilePhotoUrl: true,
                headline: true,
                about: true,
                city: true,
                country: true,
              },
            },
            socialProfiles: {
              select: { platform: true, url: true },
            },
            education: {
              orderBy: { isCurrent: "desc" },
              select: {
                id: true,
                type: true,
                institution: true,
                degree: true,
                branch: true,
                cgpa: true,
              },
            },
          },
        })
        .catch(() => null),
      db.userSkill
        .findMany({
          where: { userId: user.id },
          include: {
            skill: {
              include: { category: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        })
        .catch(() => []),
      db.userProject
        .findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        })
        .catch(() => []),
    ]);

    const resolvedUser = fullUser || {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: null,
      socialProfiles: [],
      education: [],
    };

    const portfolioConfig = getPortfolioConfig(user.username || user.id);

    return Response.json(
      apiSuccess({
        user: resolvedUser,
        skills: skills || [],
        projects: projects || [],
        portfolioConfig,
        templates: Object.values(TEMPLATE_REGISTRY),
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const template = body.template as PortfolioTemplateId | undefined;
    if (template && !TEMPLATE_REGISTRY[template]) {
      throw new ValidationError({
        template: [`Invalid template. Allowed: ${Object.keys(TEMPLATE_REGISTRY).join(", ")}`],
      });
    }

    const updatedConfig = savePortfolioConfig(user.username || user.id, {
      template: template || undefined,
      bannerUrl: body.bannerUrl !== undefined ? body.bannerUrl : undefined,
      avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl : undefined,
      headline: body.headline !== undefined ? body.headline : undefined,
      bio: body.bio !== undefined ? body.bio : undefined,
      projectImages: body.projectImages || undefined,
      accentColor: body.accentColor || undefined,
    });

    // Also update profile headline/about if passed
    if (body.headline !== undefined || body.bio !== undefined) {
      await db.profile
        .upsert({
          where: { userId: user.id },
          update: {
            headline: body.headline !== undefined ? body.headline : undefined,
            about: body.bio !== undefined ? body.bio : undefined,
          },
          create: {
            userId: user.id,
            headline: body.headline || null,
            about: body.bio || null,
          },
        })
        .catch(() => null);
    }

    return Response.json(
      apiSuccess({
        message: "Portfolio customized successfully",
        portfolioConfig: updatedConfig,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
