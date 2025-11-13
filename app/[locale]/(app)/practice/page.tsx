import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PracticeLandingClient } from "./practice-landing-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const supabase = await createServerSupabaseClient();
  const tCommon = await getTranslations("common");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCommon("loginRequired")}</div>;
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

  // Fetch custom openings
  const { data: customOpenings } = await supabase
    .from('custom_openings')
    .select('id, name, description, color, moves')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  // Fetch recent practice sessions with proper joins
  const { data: progressData } = await supabase
    .from('user_progress')
    .select(`
      *,
      opening:openings(id, name, eco, category),
      custom_opening:custom_openings(id, name)
    `)
    .eq('user_id', user.id)
    .order('last_practiced', { ascending: false })
    .limit(20);

  // Group by opening and get unique recent openings
  const recentOpeningsMap = new Map();

  progressData?.forEach((progress: any) => {
    if (progress.opening_id && progress.opening && !recentOpeningsMap.has(progress.opening_id)) {
      recentOpeningsMap.set(progress.opening_id, {
        id: progress.opening.id,
        name: progress.opening.name,
        eco: progress.opening.eco,
        category: progress.opening.category,
        type: 'opening' as const,
      });
    }
  });

  const uniqueOpenings = Array.from(recentOpeningsMap.values()).slice(0, 6);

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
      customOpenings={customOpenings || []}
    />
  );
}
