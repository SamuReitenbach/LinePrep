"use client";

import { Card, CardBody, CardHeader, Divider, Switch } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SettingsClientProps {
  user: User;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">Appearance</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Dark Mode</h3>
              <p className="text-sm text-default-500">
                Toggle between light and dark theme
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
          <h2 className="text-xl font-semibold">Account</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-default-600 mb-2">Email</h3>
            <p className="text-foreground">{user.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-default-600 mb-2">Account Created</h3>
            <p className="text-foreground">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
