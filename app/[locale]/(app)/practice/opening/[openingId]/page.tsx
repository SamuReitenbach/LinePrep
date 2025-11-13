import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PracticeClient } from "../../practice-client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function PracticeOpeningPage({
  params,
  searchParams,
}: {
  params: Promise<{ openingId: string }>;
  searchParams: Promise<{ variationId?: string }>;
}) {
  const { openingId } = await params;
  const { variationId } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const tCommon = await getTranslations("common");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCommon("loginRequired")}</div>;
  }

  // Fetch the opening
  const { data: opening, error: openingError } = await supabase
    .from('openings')
    .select('id, name')
    .eq('id', openingId)
    .single();

  if (openingError || !opening) {
    notFound();
  }

  // Fetch variation if specified
  let variation = null;
  if (variationId) {
    const { data: variationData } = await supabase
      .from('variations')
      .select('id, name')
      .eq('id', variationId)
      .single();
    
    variation = variationData;
  }

  return (
    <PracticeClient
      mode="opening"
      openingId={openingId}
      openingName={opening.name}
      variationId={variationId}
      variationName={variation?.name}
      userId={user.id}
    />
  );
}
