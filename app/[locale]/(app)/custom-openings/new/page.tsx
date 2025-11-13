import { CustomOpeningForm } from "../custom-opening-form";
import { getTranslations } from "next-intl/server";

export default async function NewCustomOpeningPage() {
  const tCustom = await getTranslations("customOpenings");

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{tCustom("create")}</h1>
        <p className="text-default-500">{tCustom("list.subtitle")}</p>
      </div>

      <CustomOpeningForm mode="create" />
    </div>
  );
}
