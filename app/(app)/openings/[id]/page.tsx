import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { OpeningDetailClient } from "./opening-detail-client";

export const dynamic = 'force-dynamic';

interface UserProgress {
  id: string;
  user_id: string;
  opening_id: string | null;
  move_number: number;
  position_fen: string;
  correct_move: string;
  correct_count: number;
  incorrect_count: number;
  last_practiced: string;
}

interface UserStack {
  id: string;
  name: string;
  description: string | null;
}

export default async function OpeningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the opening with variations
  const { data: opening, error } = await supabase
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
    .eq('id', id)
    .single();

  if (error || !opening) {
    notFound();
  }

  // Fetch user's progress for this opening
  let userProgress: UserProgress[] = [];
  if (user) {
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('opening_id', id);
    
    userProgress = progressData || [];
  }

  // Fetch user's learning stacks for the "Add to Stack" feature
  let userStacks: UserStack[] = [];
  if (user) {
    const { data: stacksData } = await supabase
      .from('learning_stacks')
      .select('id, name, description')
      .eq('user_id', user.id);
    
    userStacks = stacksData || [];
  }

  return (
    <OpeningDetailClient
      opening={opening}
      userProgress={userProgress}
      userStacks={userStacks}
      userId={user?.id || null}
    />
  );
}