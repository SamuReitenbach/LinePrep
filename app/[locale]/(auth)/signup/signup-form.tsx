"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardBody, CardHeader, Input, Button, Divider } from "@heroui/react";
import { Link, useRouter } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.signup");
  const tCommon = useTranslations("common");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError(t("errorPasswordMatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("errorPasswordLength"));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(true);
        // If email confirmation is disabled, redirect immediately
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error: any) {
      setError(error.message || t("errorSignUp"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || t("errorGoogle"));
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
            {t("confirmationSent")} <strong>{email}</strong>
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
        <p className="text-sm text-default-500">{t("subtitle")}</p>
      </CardHeader>
      <CardBody className="gap-4">
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input
            label={tCommon("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            autoComplete="email"
          />
          <Input
            label={tCommon("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            autoComplete="new-password"
          />
          <Input
            label={tCommon("confirmPassword")}
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isRequired
            autoComplete="new-password"
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
            {t("createAccountButton")}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Divider className="flex-1" />
          <span className="text-sm text-default-400">{tCommon("or")}</span>
          <Divider className="flex-1" />
        </div>

        <Button
          variant="bordered"
          size="lg"
          onPress={handleGoogleSignup}
          isDisabled={loading}
          className="w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t("googleButton")}
        </Button>

        <div className="text-center text-sm text-default-500">
          {t("termsText")}
        </div>

        <Divider />

        <div className="text-center text-sm">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-primary font-semibold">
            {t("signInLink")}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}