import { getLocale } from "next-intl/server";
import { redirect } from "@/lib/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const supabase = await createServerSupabaseClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to dashboard if already authenticated
  if (user) {
    redirect({ href: "/dashboard", locale });
  }

  return <SignupForm />;
}