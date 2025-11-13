import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StackForm } from "../../stack-form";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function EditStackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const tStacks = await getTranslations("stacks");
  const tCommon = await getTranslations("common");
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>{tCommon("loginRequired")}</div>;
  }

  // Fetch the stack
  const { data: stack, error } = await supabase
    .from('learning_stacks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !stack) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-default-500">
        <Link href="/stacks" className="hover:text-default-700">
          {tStacks("title")}
        </Link>
        {" / "}
        <Link href={`/stacks/${stack.id}`} className="hover:text-default-700">
          {stack.name}
        </Link>
        {" / "}
        <span className="text-default-900">{tStacks("edit")}</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{tStacks("edit")}</h1>
        <p className="text-default-500">{tStacks("list.subtitle")}</p>
      </div>

      <StackForm
        mode="edit"
        initialData={{
          id: stack.id,
          name: stack.name,
          description: stack.description,
        }}
      />
    </div>
  );
}
