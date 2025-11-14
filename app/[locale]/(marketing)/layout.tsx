import { useTranslations, useLocale } from "next-intl";
import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-4 gap-2">
        <div className="flex items-center gap-4 text-sm">
          <Link
            href={`/${locale}/impressum`}
            className="text-default-600 hover:text-default-900"
            size="sm"
          >
            {t("imprint")}
          </Link>
          <span className="text-default-400">•</span>
          <Link
            href={`/${locale}/privacy`}
            className="text-default-600 hover:text-default-900"
            size="sm"
          >
            {t("privacy")}
          </Link>
        </div>
        <p className="text-sm text-default-500">{t("copyright")}</p>
      </footer>
    </div>
  );
}