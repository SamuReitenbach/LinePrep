import { redirect } from "@/lib/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  return <ProfileClient user={user!} />;
}
