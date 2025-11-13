import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StackDetailClient } from "./stack-detail-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const tStacks = await getTranslations("stacks");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tStacks("errors.loginRequired")}</div>;
  }

  // Fetch the stack
  const { data: stack, error: stackError } = await supabase
    .from('learning_stacks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (stackError || !stack) {
    notFound();
  }

  // Fetch stack openings with related data
  const { data: stackOpenings, error: openingsError } = await supabase
    .from('stack_openings')
    .select(`
      id,
      practice_move_numbers,
      opening:openings(
        id,
        name,
        eco,
        category,
        moves,
        description
      ),
      custom_opening:custom_openings(
        id,
        name,
        moves,
        color,
        description
      ),
      variation:variations(
        id,
        name,
        branch_at_move
      )
    `)
    .eq('stack_id', id);

  if (openingsError) {
    console.error('Error fetching stack openings:', openingsError);
  }

  return (
    <StackDetailClient
      stack={stack}
      stackOpenings={stackOpenings || []}
      userId={user.id}
    />
  );
}
