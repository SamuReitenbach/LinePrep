import { createServerSupabaseClient } from "@/lib/supabase/server";
import { OpeningsClient } from "./openings-client";

export const dynamic = 'force-dynamic';

export default async function OpeningsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all openings with their variations
  const { data: openings, error } = await supabase
    .from('openings')
    .select(`
      id,
      name,
      eco,
      category,
      moves,
      description,
      popularity,
      variations:variations(
        id,
        name,
        moves,
        branch_at_move,
        description
      )
    `)
    .order('popularity', { ascending: false });

  if (error) {
    console.error('Error fetching openings:', error);
    return <div>Error loading openings</div>;
  }

  // Get unique categories for filtering
  const categories = Array.from(
    new Set(openings?.map((o) => o.category) || [])
  ).sort();

  return <OpeningsClient openings={openings || []} categories={categories} />;
}