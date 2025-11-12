import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CustomOpeningsClient } from "./custom-openings-client";

export const dynamic = 'force-dynamic';

export default async function CustomOpeningsPage() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your custom openings</div>;
  }

  // Fetch user's custom openings
  const { data: customOpenings, error } = await supabase
    .from('custom_openings')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom openings:', error);
    return <div>Error loading custom openings</div>;
  }

  return <CustomOpeningsClient openings={customOpenings || []} />;
}