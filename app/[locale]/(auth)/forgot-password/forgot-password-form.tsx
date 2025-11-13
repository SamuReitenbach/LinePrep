"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";
import { Link } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("auth.forgotPassword");
  const tCommon = useTranslations("common");
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t("errorSend"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-8 gap-4">
          <div className="text-4xl">✉️</div>
          <h2 className="text-2xl font-bold">{t("checkEmail")}</h2>
          <p className="text-default-500">
            {t("resetLinkSent")} <strong>{email}</strong>
          </p>
          <p className="text-sm text-default-400">
            {t("clickLink")}
          </p>
          <Button
            as={Link}
            href="/login"
            variant="flat"
            className="mt-4"
          >
            {t("backToLogin")}
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-1 items-center pb-4 pt-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-default-500">
          {t("subtitle")}
        </p>
      </CardHeader>
      <CardBody className="gap-4">
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <Input
            label={tCommon("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            autoComplete="email"
          />

          {error && (
            <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
          >
            {t("sendButton")}
          </Button>
        </form>

        <div className="text-center text-sm">
          {t("rememberPassword")}{" "}
          <Link href="/login" className="text-primary font-semibold">
            {tCommon("signIn")}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}