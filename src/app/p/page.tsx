import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth-middleware";

export const dynamic = "force-dynamic";

export default async function ShowcaseRootPage() {
  try {
    const user = await getAuthUser();
    if (user?.username) {
      redirect(`/p/${user.username}`);
    }
  } catch {
    // If not authenticated or error, redirect to preview showcase
  }

  redirect("/p/preview");
}

