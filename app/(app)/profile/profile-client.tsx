"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Avatar, Divider, Button, Input, Textarea } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: User;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user.user_metadata?.display_name || user.email?.split("@")[0] || ""
  );
  const [bio, setBio] = useState(user.user_metadata?.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim(),
          bio: bio.trim(),
        },
      });

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "");
    setBio(user.user_metadata?.bio || "");
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditing && (
          <Button color="primary" onPress={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex gap-4 items-center p-6">
          <Avatar
            name={getInitials()}
            size="lg"
            className="w-20 h-20 text-2xl"
            color="primary"
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {user.user_metadata?.display_name || user.email?.split("@")[0]}
            </h2>
            <p className="text-sm text-default-500">{user.email}</p>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          {error && (
            <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-success text-sm bg-success-50 p-3 rounded-lg">
              {success}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Display Name"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
              />

              <Textarea
                label="Bio"
                placeholder="Tell us about yourself (optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                minRows={4}
                maxLength={500}
              />

              <div className="flex gap-3">
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={loading}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="flat"
                  onPress={handleCancel}
                  isDisabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">Display Name</h3>
                <p className="text-foreground">
                  {user.user_metadata?.display_name || user.email?.split("@")[0]}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">Email</h3>
                <p className="text-foreground">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">Bio</h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {user.user_metadata?.bio || "No bio added yet."}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">Member Since</h3>
                <p className="text-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
