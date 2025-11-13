"use client";

import { Card, CardBody, CardHeader, Divider, Switch, Select, SelectItem } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/navigation";

interface SettingsClientProps {
  user: User;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    // The router from next-intl navigation automatically handles locale switching
    router.push(pathname, { locale: newLocale });
  };

  if (!mounted) {
    return null;
  }

  const practiceToggles = [
    { key: "autoAdvance", defaultSelected: true },
    { key: "moveHints", defaultSelected: false },
    { key: "soundEffects", defaultSelected: true },
  ] as const;

  const boardToggles = [
    { key: "showCoordinates", defaultSelected: true },
    { key: "highlightMoves", defaultSelected: true },
    { key: "animationSpeed", defaultSelected: true },
  ] as const;

  const spacedToggles = [
    { key: "reminders", defaultSelected: false },
    { key: "prioritizeWeak", defaultSelected: true },
    { key: "dailyGoal", defaultSelected: false },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">{t("language.title")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("language.description")}</h3>
            <Select
              selectedKeys={[locale]}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="max-w-xs"
            >
              <SelectItem key="en">
                {t("language.english")}
              </SelectItem>
              <SelectItem key="de">
                {t("language.german")}
              </SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">{t("theme.title")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">{t("theme.darkMode")}</h3>
              <p className="text-sm text-default-500">
                {t("theme.description")}
              </p>
            </div>
            <Switch
              isSelected={theme === "dark"}
              onValueChange={(checked) => setTheme(checked ? "dark" : "light")}
              size="lg"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">{t("practice.title")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          {practiceToggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">
                  {t(`practice.${item.key}.title`)}
                </h3>
                <p className="text-sm text-default-500">
                  {t(`practice.${item.key}.description`)}
                </p>
              </div>
              <Switch defaultSelected={item.defaultSelected} size="lg" />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">{t("board.title")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          {boardToggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">
                  {t(`board.${item.key}.title`)}
                </h3>
                <p className="text-sm text-default-500">
                  {t(`board.${item.key}.description`)}
                </p>
              </div>
              <Switch defaultSelected={item.defaultSelected} size="lg" />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">{t("spacedRepetition.title")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          {spacedToggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">
                  {t(`spacedRepetition.${item.key}.title`)}
                </h3>
                <p className="text-sm text-default-500">
                  {t(`spacedRepetition.${item.key}.description`)}
                </p>
              </div>
              <Switch defaultSelected={item.defaultSelected} size="lg" />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
