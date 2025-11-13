"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/navigation";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

const FlagUS = () => (
  <span className="inline-flex h-4 w-6 overflow-hidden rounded-sm shadow-sm">
    <svg viewBox="0 0 7410 3900" xmlns="http://www.w3.org/2000/svg">
      <path fill="#b22234" d="M0 0h7410v3900H0z" />
      <path
        stroke="#fff"
        strokeWidth="300"
        d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410"
      />
      <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
      <g fill="#fff">
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
            <path
              key={`${row}-${col}`}
              d="M247 90l70 215-185-135h230L177 305z"
              transform={`translate(${row % 2 === 0 ? 247 + col * 494 : 494 + col * 494} ${
                90 + row * 210
              }) scale(0.8)`}
            />
          ))
        )}
      </g>
    </svg>
  </span>
);

const FlagDE = () => (
  <span className="inline-flex h-4 w-6 overflow-hidden rounded-sm shadow-sm">
    <svg viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000" d="M0 0h5v1H0z" />
      <path fill="#D00" d="M0 1h5v1H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  </span>
);

const localeConfig: Record<
  string,
  { label: string; Flag: React.ComponentType }
> = {
  en: { label: "English", Flag: FlagUS },
  "en-US": { label: "English", Flag: FlagUS },
  de: { label: "Deutsch", Flag: FlagDE },
  "de-DE": { label: "Deutsch", Flag: FlagDE },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const normalized = localeConfig[locale]
    ? locale
    : locale.split("-")[0];

  const activeLocale = localeConfig[normalized] ?? {
    label: normalized.toUpperCase(),
    Flag: () => <span>🌐</span>,
  };

  const switchLanguage = (newLocale: string) => {
    // The router from next-intl navigation automatically handles locale switching
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          aria-label="Switch language"
          size="sm"
          className="gap-2 px-3"
        >
          <span className="text-lg leading-none">
            <activeLocale.Flag />
          </span>
          <span className="text-sm font-medium uppercase">
            {normalized}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectedKeys={new Set([normalized])}
        selectionMode="single"
        onAction={(key) => switchLanguage(key as string)}
      >
        {Object.entries(localeConfig)
          .filter(([key]) => !key.includes("-"))
          .map(([key, value]) => (
            <DropdownItem key={key} className="flex items-center gap-2">
            <span className="text-lg leading-none">
              <value.Flag />
            </span>
            <span> {value.label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
