"use client";

import { Link as HeroUILink } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-16 py-8 md:py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span className={title({ color: "pink" })}>Line</span>
          <span className={title({ color: "blue" })}>Prep&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            {t("hero.title")}
          </div>
          <p className="text-lg text-default-600 mt-6 max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/signup"
          >
            {t("hero.getStarted")}
          </Link>
          <HeroUILink
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </HeroUILink>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto w-full px-6">
        <h2 className="text-3xl font-bold text-center mb-12">{t("features.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3">{t("features.spacedRepetition.title")}</h3>
              <p className="text-default-600">
                {t("features.spacedRepetition.description")}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">{t("features.database.title")}</h3>
              <p className="text-default-600">
                {t("features.database.description")}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-3">{t("features.stacks.title")}</h3>
              <p className="text-default-600">
                {t("features.stacks.description")}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">{t("features.progress.title")}</h3>
              <p className="text-default-600">
                {t("features.progress.description")}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">♟️</div>
              <h3 className="text-xl font-bold mb-3">{t("features.interactive.title")}</h3>
              <p className="text-default-600">
                {t("features.interactive.description")}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">{t("features.custom.title")}</h3>
              <p className="text-default-600">
                {t("features.custom.description")}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto w-full px-6">
        <h2 className="text-3xl font-bold text-center mb-12">{t("howItWorks.title")}</h2>
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step1.title")}</h3>
              <p className="text-default-600">
                {t("howItWorks.step1.description")}
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step2.title")}</h3>
              <p className="text-default-600">
                {t("howItWorks.step2.description")}
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step3.title")}</h3>
              <p className="text-default-600">
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-2xl mx-auto w-full px-6 text-center">
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <CardBody className="p-12">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-lg text-default-600 mb-8">
              {t("cta.subtitle")}
            </p>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
              href="/signup"
            >
              {t("cta.button")}
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}