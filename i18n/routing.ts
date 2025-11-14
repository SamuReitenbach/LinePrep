import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/imprint": {
    en: "/imprint",
    de: "/impressum",
  },
  "/privacy": {
    en: "/privacy",
    de: "/datenschutz",
  },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
