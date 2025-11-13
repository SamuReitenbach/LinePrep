import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PracticeClient } from "../../practice-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function PracticeStackPage({
  params,
}: {
  params: Promise<{ stackId: string }>;
}) {
  const { stackId } = await params;
  const supabase = await createServerSupabaseClient();
  const tCommon = await getTranslations("common");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCommon("loginRequired")}</div>;
  }

  // Fetch the stack
  const { data: stack, error: stackError } = await supabase
    .from('learning_stacks')
    .select('id, name')
    .eq('id', stackId)
    .eq('user_id', user.id)
    .single();

  if (stackError || !stack) {
    notFound();
  }

  return (
    <PracticeClient
      mode="stack"
      stackId={stackId}
      stackName={stack.name}
      userId={user.id}
    />
  );
}
