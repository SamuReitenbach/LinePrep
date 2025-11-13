import { getLocale } from "next-intl/server";
import { redirect } from "@/lib/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to dashboard if already authenticated
  if (user) {
    redirect({ href: "/dashboard", locale });
  }

  return <LoginForm />;
}