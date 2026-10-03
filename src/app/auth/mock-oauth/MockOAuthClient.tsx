"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleIcon,
  AppleIcon,
  LinkedInIcon,
  MicrosoftIcon,
} from "@/components/ui/SocialIcons";
import { ShieldCheck, UserCheck, ArrowRight, X } from "lucide-react";

interface MockOAuthClientProps {
  provider: string;
  stateParam: string;
}

export function MockOAuthClient({ provider, stateParam }: MockOAuthClientProps) {
  const router = useRouter();

  const providerName =
    provider.toLowerCase() === "google"
      ? "Google"
      : provider.toLowerCase() === "apple"
      ? "Apple ID"
      : provider.toLowerCase() === "linkedin"
      ? "LinkedIn"
      : "Microsoft";

  const [name, setName] = useState("Alex Learner");
  const [email, setEmail] = useState(`alex.learner@${provider.toLowerCase()}.com`);

  const setPreset = (presetName: string, presetEmail: string) => {
    setName(presetName);
    setEmail(presetEmail);
  };

  const handleAuthorize = () => {
    const payload = {
      id: `${provider}_id_${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces`,
    };

    // Encode payload as mock code
    const mockCode =
      "mock_code_" +
      Buffer.from(JSON.stringify(payload)).toString("base64url");

    const callbackUrl = `/api/auth/callback/${provider}?code=${encodeURIComponent(
      mockCode
    )}&state=${encodeURIComponent(stateParam)}`;

    router.push(callbackUrl);
  };

  const handleCancel = () => {
    const cancelUrl = `/api/auth/callback/${provider}?error=access_denied&state=${encodeURIComponent(
      stateParam
    )}`;
    router.push(cancelUrl);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header with Provider Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            {provider.toLowerCase() === "google" && <GoogleIcon size={32} />}
            {provider.toLowerCase() === "apple" && (
              <AppleIcon size={32} className="text-white" />
            )}
            {provider.toLowerCase() === "linkedin" && <LinkedInIcon size={32} />}
            {provider.toLowerCase() === "microsoft" && <MicrosoftIcon size={32} />}
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Sign in with {providerName}
          </h1>
          <p className="text-xs text-slate-400">
            NextDrive Academy is requesting access to your basic identity profile.
          </p>
        </div>

        {/* Permissions Scope Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Requested Permissions</span>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-5">
            <li>Verify your verified email address</li>
            <li>Retrieve your full name and public avatar</li>
            <li>Associate your {providerName} ID with NextDrive</li>
          </ul>
        </div>

        {/* Preset Test Profiles */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick-Select Test Persona
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setPreset("Alex Learner", `alex.learner@${provider.toLowerCase()}.com`)
              }
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-left text-xs transition cursor-pointer"
            >
              <div className="font-semibold text-slate-200">New Learner</div>
              <div className="text-[10px] text-slate-400 truncate">
                alex.learner@{provider.toLowerCase()}.com
              </div>
            </button>
            <button
              type="button"
              onClick={() =>
                setPreset("Sarah ADI Instructor", `sarah.adi@${provider.toLowerCase()}.com`)
              }
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-left text-xs transition cursor-pointer"
            >
              <div className="font-semibold text-slate-200">New Instructor</div>
              <div className="text-[10px] text-slate-400 truncate">
                sarah.adi@{provider.toLowerCase()}.com
              </div>
            </button>
          </div>
        </div>

        {/* Custom Profile Inputs */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Account Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleAuthorize}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Authorize &amp; Continue to NextDrive</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium text-xs transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
