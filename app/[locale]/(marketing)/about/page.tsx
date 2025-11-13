"use client";

import { Link } from "@heroui/link";
import { Button, Card, CardBody } from "@heroui/react";
import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";

const featureItems = [
  { icon: "📚", titleKey: "features.database.title", descriptionKey: "features.database.description" },
  { icon: "♟️", titleKey: "features.practice.title", descriptionKey: "features.practice.description" },
  { icon: "📦", titleKey: "features.stacks.title", descriptionKey: "features.stacks.description" },
  { icon: "📈", titleKey: "features.progress.title", descriptionKey: "features.progress.description" },
  { icon: "✨", titleKey: "features.custom.title", descriptionKey: "features.custom.description" },
  { icon: "🎯", titleKey: "features.spaced.title", descriptionKey: "features.spaced.description" },
];

const steps = [
  { number: "1", titleKey: "howItWorks.steps.choose.title", descriptionKey: "howItWorks.steps.choose.description" },
  { number: "2", titleKey: "howItWorks.steps.practice.title", descriptionKey: "howItWorks.steps.practice.description" },
  { number: "3", titleKey: "howItWorks.steps.track.title", descriptionKey: "howItWorks.steps.track.description" },
  { number: "4", titleKey: "howItWorks.steps.master.title", descriptionKey: "howItWorks.steps.master.description" },
];

const technologyStack = ["next", "supabase", "heroui", "chess"] as const;

export default function AboutPage() {
  const t = useTranslations("marketing.about");

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className={title()}>{t("hero.title")}</h1>
        <p className="text-xl text-default-600 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">{t("mission.title")}</h2>
        <p className="text-lg text-default-600">{t("mission.paragraph1")}</p>
        <p className="text-lg text-default-600">{t("mission.paragraph2")}</p>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">{t("features.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureItems.map((feature) => (
            <Card key={feature.titleKey}>
              <CardBody className="space-y-2">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-bold">{t(feature.titleKey)}</h3>
                <p className="text-default-600">{t(feature.descriptionKey)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">{t("howItWorks.title")}</h2>
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t(step.titleKey)}</h3>
                <p className="text-default-600">{t(step.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">{t("technology.title")}</h2>
        <p className="text-lg text-default-600">{t("technology.description")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologyStack.map((item) => (
            <Card key={item}>
              <CardBody className="text-center py-6">
                <p className="font-bold">{t(`technology.stack.${item}.title`)}</p>
                <p className="text-sm text-default-500">{t(`technology.stack.${item}.description`)}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">{t("cta.description")}</p>
        <div className="flex gap-4 justify-center">
          <Button as={Link} href="/signup" color="primary" size="lg" className="font-semibold">
            {t("cta.primary")}
          </Button>
          <Button as={Link} href="/openings" variant="bordered" size="lg">
            {t("cta.secondary")}
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t("contact.title")}</h2>
        <p className="text-lg text-default-600">{t("contact.description")}</p>
        <p className="text-default-600">
          {t("contact.creator", { name: "Samuel Reitenbach" })}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="https://github.com/SamuReitenbach/LinePrep"
            isExternal
            variant="flat"
          >
            {t("contact.cta")}
          </Button>
        </div>
      </section>
    </div>
  );
}
