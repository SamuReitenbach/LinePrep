"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Avatar, Divider, Button, Input, Textarea } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

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

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);

    try {
      // First, verify the current password by attempting to sign in with it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      // If sign in successful, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      // Optional: Sign out and redirect to login
      // await supabase.auth.signOut();
      // router.push("/login");
    } catch (err: any) {
      console.error("Error changing password:", err);
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setIsChangingPassword(false);
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

      {/* Password Change Section */}
      <Card>
        <CardHeader className="p-6">
          <div className="flex items-center gap-2">
            <Lock size={20} />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-6">
          {passwordError && (
            <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="text-success text-sm bg-success-50 p-3 rounded-lg">
              {passwordSuccess}
            </div>
          )}

          {isChangingPassword ? (
            <div className="space-y-4">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                label="Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} className="text-default-400" />
                    ) : (
                      <Eye size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />

              <Input
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                description="Must be at least 6 characters"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} className="text-default-400" />
                    ) : (
                      <Eye size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />

              <Input
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="text-default-400" />
                    ) : (
                      <Eye size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />

              <div className="flex gap-3">
                <Button
                  color="primary"
                  onPress={handlePasswordChange}
                  isLoading={passwordLoading}
                  className="flex-1"
                >
                  Change Password
                </Button>
                <Button
                  variant="flat"
                  onPress={handleCancelPasswordChange}
                  isDisabled={passwordLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-default-600 mb-4">
                Update your password to keep your account secure.
              </p>
              <Button
                color="default"
                variant="flat"
                onPress={() => setIsChangingPassword(true)}
                startContent={<Lock size={16} />}
              >
                Change Password
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
