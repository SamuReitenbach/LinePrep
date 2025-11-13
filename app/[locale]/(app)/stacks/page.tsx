import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StacksClient } from "./stacks-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

interface LearningStack {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default async function StacksPage() {
  const supabase = await createServerSupabaseClient();
  const tStacks = await getTranslations("stacks");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tStacks("errors.loginRequired")}</div>;
  }

  // Fetch user's learning stacks with opening counts
  const { data: stacks, error } = await supabase
    .from('learning_stacks')
    .select(`
      id,
      name,
      description,
      created_at,
      updated_at,
      stack_openings:stack_openings(count)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching stacks:', error);
    return <div>{tStacks("errors.fetchFailed")}</div>;
  }

  // Transform the data to include opening count
  const stacksWithCount = (stacks || []).map((stack: any) => ({
    id: stack.id,
    name: stack.name,
    description: stack.description,
    created_at: stack.created_at,
    updated_at: stack.updated_at,
    openingCount: stack.stack_openings?.[0]?.count || 0,
  }));

  return <StacksClient stacks={stacksWithCount} />;
}
