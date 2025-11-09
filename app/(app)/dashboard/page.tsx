import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
  const supabase = await createServerSupabaseClient();

  // Fetch user statistics
  const { data: stacks, count: stacksCount } = await supabase
    .from('learning_stacks')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  const { data: customOpenings, count: customOpeningsCount } = await supabase
    .from('custom_openings')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  const { data: progress } = await supabase
    .from('user_progress')
    .select('correct_count, incorrect_count')
    .eq('user_id', userId);

  // Calculate statistics
  const totalAttempts = progress?.reduce(
    (sum, p) => sum + p.correct_count + p.incorrect_count,
    0
  ) || 0;

  const correctAttempts = progress?.reduce(
    (sum, p) => sum + p.correct_count,
    0
  ) || 0;

  const accuracy = totalAttempts > 0 
    ? Math.round((correctAttempts / totalAttempts) * 100) 
    : 0;

  return {
    stacks: stacks || [],
    stacksCount: stacksCount || 0,
    customOpenings: customOpenings || [],
    customOpeningsCount: customOpeningsCount || 0,
    totalAttempts,
    accuracy,
  };
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const data = await getDashboardData(user.id);
  const username = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Chess Master';

  return <DashboardClient data={data} username={username} />;
}