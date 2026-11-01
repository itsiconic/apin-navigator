import { NextRequest } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";
import { apiSuccess } from "@/lib/errors";

export async function POST(request: NextRequest) {
  await clearAdminSessionCookie();
  return Response.json(apiSuccess({ message: "Admin logged out successfully." }));
}
