import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = React.use(params).locale;
  setRequestLocale(locale);
  const t = useTranslations("legal.privacy");

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.overview.title")}
          </h2>
          <p className="mb-4">{t("sections.overview.paragraph1")}</p>
          <p>{t("sections.overview.paragraph2")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.controller.title")}
          </h2>
          <p className="mb-2">
            <strong>{t("sections.controller.name")}:</strong> Samuel Reitenbach
          </p>
          <p className="mb-2">
            <strong>{t("sections.controller.address")}:</strong> Eichenstr. 8
          </p>
          <p className="mb-2">49090 Osnabrück</p>
          <p className="mb-2">
            <strong>{t("sections.controller.email")}:</strong> samuel.reitenbach@gmail.com
          </p>
          <p className="mb-4">
            <strong>{t("sections.controller.phone")}:</strong> +49 15788197955
          </p>
          <p>{t("sections.controller.note")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.dataCollection.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.dataCollection.personal.title")}
          </h3>
          <p className="mb-4">{t("sections.dataCollection.personal.intro")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t("sections.dataCollection.personal.items.email")}</li>
            <li>{t("sections.dataCollection.personal.items.username")}</li>
            <li>{t("sections.dataCollection.personal.items.practice")}</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.dataCollection.technical.title")}
          </h3>
          <p className="mb-4">{t("sections.dataCollection.technical.intro")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t("sections.dataCollection.technical.items.ip")}</li>
            <li>{t("sections.dataCollection.technical.items.browser")}</li>
            <li>{t("sections.dataCollection.technical.items.time")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.legalBasis.title")}
          </h2>
          <p className="mb-4">{t("sections.legalBasis.intro")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>{t("sections.legalBasis.items.consent.title")}:</strong>{" "}
              {t("sections.legalBasis.items.consent.content")}
            </li>
            <li>
              <strong>{t("sections.legalBasis.items.contract.title")}:</strong>{" "}
              {t("sections.legalBasis.items.contract.content")}
            </li>
            <li>
              <strong>
                {t("sections.legalBasis.items.legitimate.title")}:
              </strong>{" "}
              {t("sections.legalBasis.items.legitimate.content")}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.thirdParty.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.thirdParty.supabase.title")}
          </h3>
          <p className="mb-4">{t("sections.thirdParty.supabase.content")}</p>
          <p className="mb-2">
            {t("sections.thirdParty.supabase.privacy")}:{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://supabase.com/privacy
            </a>
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.thirdParty.google.title")}
          </h3>
          <p className="mb-4">{t("sections.thirdParty.google.content")}</p>
          <p className="mb-2">
            {t("sections.thirdParty.google.privacy")}:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://policies.google.com/privacy
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.cookies.title")}
          </h2>
          <p className="mb-4">{t("sections.cookies.paragraph1")}</p>
          <p>{t("sections.cookies.paragraph2")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.rights.title")}
          </h2>
          <p className="mb-4">{t("sections.rights.intro")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>{t("sections.rights.items.access.title")}:</strong>{" "}
              {t("sections.rights.items.access.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.rectification.title")}:</strong>{" "}
              {t("sections.rights.items.rectification.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.erasure.title")}:</strong>{" "}
              {t("sections.rights.items.erasure.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.restriction.title")}:</strong>{" "}
              {t("sections.rights.items.restriction.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.portability.title")}:</strong>{" "}
              {t("sections.rights.items.portability.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.objection.title")}:</strong>{" "}
              {t("sections.rights.items.objection.content")}
            </li>
            <li>
              <strong>{t("sections.rights.items.withdraw.title")}:</strong>{" "}
              {t("sections.rights.items.withdraw.content")}
            </li>
          </ul>
          <p>{t("sections.rights.complaint")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.retention.title")}
          </h2>
          <p>{t("sections.retention.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.security.title")}
          </h2>
          <p>{t("sections.security.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.changes.title")}
          </h2>
          <p>{t("sections.changes.content")}</p>
        </section>

        <section className="mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("lastUpdated")}: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}

// Required for Next.js 15 with use() hook
import React from "react";
