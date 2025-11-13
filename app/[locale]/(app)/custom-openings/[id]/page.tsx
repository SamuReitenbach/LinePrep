import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomOpeningDetailClient } from "./custom-opening-detail-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function CustomOpeningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const tCommon = await getTranslations("common");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCommon("loginRequired")}</div>;
  }

  // Fetch the custom opening
  const { data: opening, error } = await supabase
    .from('custom_openings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !opening) {
    notFound();
  }

  // Fetch user's progress for this opening
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('custom_opening_id', id);

  // Fetch user's learning stacks
  const { data: userStacks } = await supabase
    .from('learning_stacks')
    .select('id, name, description')
    .eq('user_id', user.id)
    .order('name');

  return (
    <CustomOpeningDetailClient
      opening={opening}
      userProgress={progressData || []}
      userStacks={userStacks || []}
      userId={user.id}
    />
  );
}
