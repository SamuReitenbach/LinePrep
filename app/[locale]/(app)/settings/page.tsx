import { redirect } from "@/lib/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  return <SettingsClient user={user!} />;
}
