"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Input, Textarea, Button } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Stack name is required");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in");
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
      setError(error.message || "Failed to save stack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Stack Name"
            placeholder="e.g., Aggressive Openings, King's Pawn Games"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
            maxLength={100}
          />

          <Textarea
            label="Description"
            placeholder="Describe the theme or purpose of this stack (optional)"
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
              {mode === "create" ? "Create Stack" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="flat"
              onClick={() => router.back()}
              isDisabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}