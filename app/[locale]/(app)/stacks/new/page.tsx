import { StackForm } from "../stack-form";
import { getTranslations } from "next-intl/server";

export default async function NewStackPage() {
  const tStacks = await getTranslations("stacks");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{tStacks("create")}</h1>
        <p className="text-default-500">{tStacks("list.subtitle")}</p>
      </div>

      <StackForm mode="create" />
    </div>
  );
}
