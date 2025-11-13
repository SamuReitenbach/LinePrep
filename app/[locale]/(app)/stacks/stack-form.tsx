"use client";

import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { Card, CardBody, Input, Textarea, Button } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface StackFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function StackForm({ mode, initialData }: StackFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const tStacks = useTranslations("stacks");
  const tCommon = useTranslations("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(tStacks("errors.nameRequired"));
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(tStacks("errors.loginRequired"));
      }

      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("learning_stacks")
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        router.push(`/stacks/${data.id}`);
      } else {
        const { error: updateError } = await supabase
          .from("learning_stacks")
          .update({
            name: name.trim(),
            description: description.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData!.id);

        if (updateError) throw updateError;

        router.push(`/stacks/${initialData!.id}`);
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving stack:", error);
      setError(error.message || tStacks("errors.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={tStacks("name")}
              placeholder={tStacks("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              maxLength={100}
            />

            <Textarea
              label={tStacks("description")}
              placeholder={tStacks("descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              maxLength={500}
            />

          {error && (
            <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="flex-1"
            >
                {mode === "create" ? tStacks("create") : tStacks("save")}
              </Button>
              <Button
                type="button"
                variant="flat"
                onPress={() => router.back()}
                isDisabled={loading}
              >
                {tCommon("cancel")}
              </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
