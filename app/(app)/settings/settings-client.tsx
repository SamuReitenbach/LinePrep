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
          <h2 className="text-xl font-semibold">Practice Settings</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Auto-advance</h3>
              <p className="text-sm text-default-500">
                Automatically move to next position after correct answer
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Show Move Hints</h3>
              <p className="text-sm text-default-500">
                Highlight the piece to move after an incorrect attempt
              </p>
            </div>
            <Switch
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Sound Effects</h3>
              <p className="text-sm text-default-500">
                Play sounds for moves and feedback
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">Board Settings</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Show Coordinates</h3>
              <p className="text-sm text-default-500">
                Display rank and file labels on the board
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Highlight Legal Moves</h3>
              <p className="text-sm text-default-500">
                Show available moves when selecting a piece
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Animation Speed</h3>
              <p className="text-sm text-default-500">
                Speed of piece movement animations
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <h2 className="text-xl font-semibold">Spaced Repetition</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Practice Reminders</h3>
              <p className="text-sm text-default-500">
                Get notified when openings are due for review
              </p>
            </div>
            <Switch
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Prioritize Weak Positions</h3>
              <p className="text-sm text-default-500">
                Show positions with lower success rates more frequently
              </p>
            </div>
            <Switch
              defaultSelected
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold">Daily Goal</h3>
              <p className="text-sm text-default-500">
                Set a daily practice target (positions per day)
              </p>
            </div>
            <Switch
              size="lg"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
