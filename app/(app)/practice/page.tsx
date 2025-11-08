import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PracticeLandingClient } from "./practice-landing-client";

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  // Fetch user's stacks
  const { data: stacks } = await supabase
    .from('learning_stacks')
    .select(`
      id,
      name,
      description,
      stack_openings:stack_openings(count)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  // Fetch recent openings (most practiced)
  const { data: recentOpenings } = await supabase
    .from('user_progress')
    .select(`
      opening_id,
      openings:opening_id(id, name, eco, category)
    `)
    .eq('user_id', user.id)
    .order('last_practiced', { ascending: false })
    .limit(5);

  // Get unique openings
  const uniqueOpenings = recentOpenings
    ?.map((r: any) => r.openings)
    .filter((o: any, index: number, self: any[]) => 
      o && self.findIndex((s: any) => s?.id === o.id) === index
    ) || [];

  const stacksWithCount = (stacks || []).map((stack: any) => ({
    id: stack.id,
    name: stack.name,
    description: stack.description,
    openingCount: stack.stack_openings?.[0]?.count || 0,
  }));

  return (
    <PracticeLandingClient
      stacks={stacksWithCount}
      recentOpenings={uniqueOpenings}
    />
  );
}