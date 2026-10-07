"use client";

import React, { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
} from "lucide-react";
import { User } from "@/types";
import { UserProfilePhotoUpload } from "@/components/ui/UserProfilePhotoUpload";
import { ConnectedAccountsCard } from "@/components/shared/ConnectedAccountsCard";

interface AdminProfileClientProps {
  user: User;
}

export function AdminProfileClient({ user }: AdminProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile form state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, avatar }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setProfileSuccess("Admin profile updated successfully.");
      // Broadcast update event so header immediately reflects new name / avatar
      window.dispatchEvent(
        new CustomEvent("nextdrive:user-updated", {
          detail: { name, phone, avatar },
        })
      );
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      setSavingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/user/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <UserRound className="h-6 w-6 text-primary" />
          Administrator Account Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your operations credentials, contact details, profile photo, and platform security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserRound className="h-4 w-4" />
          General Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Security &amp; Passwords
        </button>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {profileSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Profile Photo Upload & Cropping Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs text-card-foreground">
            <UserProfilePhotoUpload
              currentAvatar={avatar}
              userName={name}
              onChange={(newUrl) => {
                setAvatar(newUrl);
                // Also trigger an automatic save
                fetch("/api/user/profile", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ avatar: newUrl }),
                });
              }}
              onRemove={() => {
                setAvatar("");
                fetch("/api/user/profile", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ avatar: "" }),
                });
                window.dispatchEvent(
                  new CustomEvent("nextdrive:user-updated", {
                    detail: { avatar: "" },
                  })
                );
              }}
            />
          </div>

          {/* Details Form Card */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs text-card-foreground space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Email Address (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address (Primary Login ID)
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-xs text-muted-foreground cursor-not-allowed pr-20"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Verified
                  </span>
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Direct Phone Number
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="tel"
                    placeholder="+44 7911 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Assigned Role */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System Role
                </label>
                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground uppercase">{user.role}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Managed by System Owner
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Passwords */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {/* Change Password Form */}
          <form
            onSubmit={handleSavePassword}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs text-card-foreground space-y-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <KeyRound className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Change Password</h3>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-border pt-4">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition cursor-pointer disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Logins Card */}
          <ConnectedAccountsCard userRole="ADMIN" />
        </div>
      )}
    </div>
  );
}
