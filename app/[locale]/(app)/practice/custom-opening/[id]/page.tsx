import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PracticeClient } from "../../practice-client";

export const dynamic = 'force-dynamic';

export default async function PracticeCustomOpeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  // Fetch the custom opening
  const { data: customOpening, error: openingError } = await supabase
    .from('custom_openings')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (openingError || !customOpening) {
    notFound();
  }

  return (
    <PracticeClient
      mode="custom-opening"
      customOpeningId={id}
      customOpeningName={customOpening.name}
      userId={user.id}
    />
  );
}