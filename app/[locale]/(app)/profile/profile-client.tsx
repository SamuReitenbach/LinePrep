"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Avatar, Divider, Button, Input, Textarea } from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface ProfileClientProps {
  user: User;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const supabase = createClient();
  const router = useRouter();
  const locale = useLocale();
  const tProfile = useTranslations("profile");
  const tCommon = useTranslations("common");

  const defaultDisplayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    tProfile("defaultName");

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [bio, setBio] = useState(user.user_metadata?.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      setSuccess(tProfile("updated"));
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || tProfile("updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(defaultDisplayName);
    setBio(user.user_metadata?.bio || "");
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = defaultDisplayName;
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

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(tProfile("password.allFieldsRequired"));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(tProfile("password.tooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(tProfile("password.mismatch"));
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(tProfile("password.sameAsCurrent"));
      return;
    }

    setPasswordLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError(tProfile("password.incorrectCurrent"));
        setPasswordLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setPasswordSuccess(tProfile("passwordUpdated"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setPasswordError(err.message || tProfile("password.changeFailed"));
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
        <h1 className="text-3xl font-bold">{tProfile("title")}</h1>
        {!isEditing && (
          <Button color="primary" onPress={() => setIsEditing(true)}>
            {tProfile("edit")}
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
              {defaultDisplayName}
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
                label={tProfile("displayName")}
                placeholder={tProfile("displayNamePlaceholder")}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
              />

              <Textarea
                label={tProfile("bio")}
                placeholder={tProfile("bioPlaceholder")}
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
                  {tProfile("save")}
                </Button>
                <Button
                  variant="flat"
                  onPress={handleCancel}
                  isDisabled={loading}
                >
                  {tCommon("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">{tProfile("displayName")}</h3>
                <p className="text-foreground">
                  {defaultDisplayName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">{tProfile("email")}</h3>
                <p className="text-foreground">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">{tProfile("bio")}</h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {user.user_metadata?.bio || tProfile("bioEmpty")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-default-600 mb-2">{tProfile("memberSince")}</h3>
                <p className="text-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(user.created_at))}
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="p-6 flex items-center gap-3">
          <Lock size={20} />
          <h2 className="text-lg font-semibold">{tProfile("changePassword")}</h2>
        </CardHeader>

        <Divider />

        <CardBody className="p-6 space-y-4">
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
            <>
              <Input
                label={tProfile("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />

              <Input
                label={tProfile("newPassword")}
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />

              <Input
                label={tProfile("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />

              <div className="flex gap-3">
                <Button
                  color="primary"
                  onPress={handlePasswordChange}
                  isLoading={passwordLoading}
                  className="flex-1"
                >
                  {tProfile("updatePassword")}
                </Button>
                <Button
                  variant="flat"
                  onPress={handleCancelPasswordChange}
                  isDisabled={passwordLoading}
                  className="flex-1"
                >
                  {tCommon("cancel")}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-default-600">
                {tProfile("changePasswordDescription")}
              </p>
              <Button
                color="default"
                variant="flat"
                onPress={() => setIsChangingPassword(true)}
                startContent={<Lock size={16} />}
              >
                {tProfile("startPasswordChange")}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
