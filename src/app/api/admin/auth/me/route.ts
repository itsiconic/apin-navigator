import { NextRequest } from "next/server";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAuthAdmin(request);
    return Response.json(apiSuccess({ admin }));
  } catch (error) {
    return handleApiError(error);
  }
}
