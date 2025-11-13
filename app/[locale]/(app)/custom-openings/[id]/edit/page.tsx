import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CustomOpeningForm } from "../../custom-opening-form";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function EditCustomOpeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const tCustom = await getTranslations("customOpenings");
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

  return (
    <div className="max-w-full space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/custom-openings" className="hover:text-default-700">
          {tCustom("title")}
        </Link>
        {" / "}
        <Link href={`/custom-openings/${opening.id}`} className="hover:text-default-700">
          {opening.name}
        </Link>
        {" / "}
        <span className="text-default-900">{tCustom("edit")}</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{tCustom("edit")}</h1>
        <p className="text-default-500">{tCustom("list.subtitle")}</p>
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
