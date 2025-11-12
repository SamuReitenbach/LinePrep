import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomOpeningForm } from "../../custom-opening-form";
import { Link } from "@heroui/link";

export const dynamic = 'force-dynamic';

export default async function EditCustomOpeningPage({
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
  const { data: opening, error } = await supabase
    .from('custom_openings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !opening) {
    notFound();
  }

  return (
    <div className="max-w-full space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/custom-openings" className="hover:text-default-700">
          Custom Openings
        </Link>
        {" / "}
        <Link href={`/custom-openings/${opening.id}`} className="hover:text-default-700">
          {opening.name}
        </Link>
        {" / "}
        <span className="text-default-900">Edit</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Custom Opening</h1>
        <p className="text-default-500">
          Update your opening line
        </p>
      </div>

      <CustomOpeningForm
        mode="edit"
        initialData={{
          id: opening.id,
          name: opening.name,
          description: opening.description,
          moves: opening.moves,
          color: opening.color,
        }}
      />
    </div>
  );
}