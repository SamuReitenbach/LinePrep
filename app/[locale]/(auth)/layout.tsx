"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitch } from "@/components/theme-switch";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-default-100">
      {/* Language and theme switcher in top right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center gap-2 justify-center mb-2">
          <Image src="/LP.png" width={40} height={40} alt="Logo" />
          <span className="text-3xl font-bold">LinePrep</span>
        </Link>
        <p className="text-default-500 text-sm">{t("tagline")}</p>
      </div>

      {/* Auth form content */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center text-sm text-default-400">
        <Link href="/" className="hover:text-default-600">
          ← {tCommon("backToHome")}
        </Link>
      </div>
    </div>
  );
}