"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoogleIcon,
  AppleIcon,
  LinkedInIcon,
  MicrosoftIcon,
} from "@/components/ui/SocialIcons";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Link as LinkIcon,
  Loader2,
  Lock,
} from "lucide-react";
import { Account } from "@/types";

interface ConnectedAccountsCardProps {
  userRole?: "ADMIN" | "STUDENT" | "INSTRUCTOR";
}

interface ProviderMeta {
  id: "google" | "apple" | "linkedin" | "microsoft";
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PROVIDERS: ProviderMeta[] = [
  {
    id: "google",
    name: "Google Account",
    desc: "Use your Google account to sign in securely.",
    icon: GoogleIcon,
  },
  {
    id: "apple",
    name: "Apple ID",
    desc: "Authenticate using Sign in with Apple.",
    icon: AppleIcon,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    desc: "Connect your professional driving instructor profile.",
    icon: LinkedInIcon,
  },
  {
    id: "microsoft",
    name: "Microsoft Account",
    desc: "Sign in with your Microsoft or Office 365 ID.",
    icon: MicrosoftIcon,
  },
];

export function ConnectedAccountsCard({ userRole }: ConnectedAccountsCardProps) {
  const pathname = usePathname();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [hasPassword, setHasPassword] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/accounts");
        if (res.ok && active) {
          const data = await res.json();
          setAccounts(data.accounts || []);
          setHasPassword(Boolean(data.hasPassword));
        }
      } catch {
        // silently handle
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleDisconnect = async (provider: string) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;

    setActionLoading(provider);
    setMessage(null);

    try {
      const res = await fetch(`/api/auth/accounts?provider=${provider}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to disconnect account.");
      }

      setAccounts((prev) => prev.filter((a) => a.provider.toLowerCase() !== provider.toLowerCase()));
      setMessage({ type: "success", text: `${provider} was successfully disconnected.` });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to disconnect.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Connected Social Accounts
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Link your social identities to enable one-click authentication across Google, Apple, and LinkedIn.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-3.5 text-xs font-medium border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Password Status Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-surface-secondary/50 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-foreground block">Email &amp; Password Login</span>
            <span className="text-[11px] text-muted-foreground">
              {hasPassword
                ? "Active password security configured."
                : "No password set. Using social login."}
            </span>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            hasPassword
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {hasPassword ? "Configured" : "Social Only"}
        </span>
      </div>

      {/* Provider List */}
      <div className="divide-y divide-border/60 border-t border-b border-border/60">
        {PROVIDERS.map((p) => {
          const Icon = p.icon;
          const isConnected = accounts.some(
            (a) => a.provider.toLowerCase() === p.id
          );
          const isOnlyLoginMethod =
            !hasPassword && accounts.length <= 1 && isConnected;

          return (
            <div
              key={p.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary border border-border/80 shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {p.name}
                    </span>
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {p.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => handleDisconnect(p.id)}
                    disabled={actionLoading === p.id || isOnlyLoginMethod}
                    title={
                      isOnlyLoginMethod
                        ? "Cannot disconnect your only login method."
                        : `Disconnect ${p.name}`
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {actionLoading === p.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Unlink className="h-3.5 w-3.5" />
                    )}
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <Link
                    href={`/api/auth/oauth/${p.id}?role=${userRole}&mode=link&redirectUrl=${encodeURIComponent(
                      pathname
                    )}`}
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span>Connect</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span>
          Account linking uses cryptographic state validation to prevent account takeover.
        </span>
      </div>
    </div>
  );
}
