import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CustomOpeningsClient } from "./custom-openings-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function CustomOpeningsPage() {
  const supabase = await createServerSupabaseClient();
  const tCustom = await getTranslations("customOpenings");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCustom("errors.loginToView")}</div>;
  }

  // Fetch user's custom openings
  const { data: customOpenings, error } = await supabase
    .from('custom_openings')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom openings:', error);
    return <div>{tCustom("errors.fetchFailed")}</div>;
  }

  return <CustomOpeningsClient openings={customOpenings || []} />;
}
