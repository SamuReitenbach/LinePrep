import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = React.use(params).locale;
  setRequestLocale(locale);
  const t = useTranslations("legal.impressum");

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.contact.title")}
          </h2>
          <p className="mb-2">
            <strong>{t("sections.contact.name")}:</strong> Samuel Reitenbach
          </p>
          <p className="mb-2">
            <strong>{t("sections.contact.address")}:</strong> Eichenstr. 8
          </p>
          <p className="mb-2">49090 Osnabrück</p>
          <p className="mb-2">{t("sections.contact.country")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.contactDetails.title")}
          </h2>
          <p className="mb-2">
            <strong>{t("sections.contactDetails.email")}:</strong>{" "}
            samuel.reitenbach@gmail.com
          </p>
          <p className="mb-2">
            <strong>{t("sections.contactDetails.phone")}:</strong> +49 15788197955
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.responsible.title")}
          </h2>
          <p>{t("sections.responsible.content")}: Samuel Reitenbach</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.euDispute.title")}
          </h2>
          <p className="mb-4">{t("sections.euDispute.content")}</p>
          <p className="mb-2">
            {t("sections.euDispute.link")}:{" "}
            <a
              href="https://consumer-redress.ec.europa.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://consumer-redress.ec.europa.eu
            </a>
          </p>
          <p>{t("sections.euDispute.email")}: samuel.reitenbach@gmail.com</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.consumerDispute.title")}
          </h2>
          <p>{t("sections.consumerDispute.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.liability.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.liability.content.title")}
          </h3>
          <p className="mb-4">{t("sections.liability.content.paragraph")}</p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            {t("sections.liability.links.title")}
          </h3>
          <p className="mb-4">{t("sections.liability.links.paragraph1")}</p>
          <p>{t("sections.liability.links.paragraph2")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("sections.copyright.title")}
          </h2>
          <p className="mb-4">{t("sections.copyright.paragraph1")}</p>
          <p>{t("sections.copyright.paragraph2")}</p>
        </section>
      </div>
    </div>
  );
}

// Required for Next.js 15 with use() hook
import React from "react";
