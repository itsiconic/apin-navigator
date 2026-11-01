/* ================================================
   POST /api/auth/change-password
   Update candidate / user password securely
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { handleApiError, apiSuccess, AppError, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    const body = await request.json();

    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    // Retrieve user with passwordHash
    const user = await db.user.findUnique({
      where: { id: authUser.id },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const isMatch = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Current password is incorrect.", 400, "INVALID_PASSWORD");
    }

    // Hash and update new password
    const newHash = await hashPassword(parsed.data.newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return Response.json(
      apiSuccess({ message: "Password updated successfully." })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
