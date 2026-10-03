import React from "react";
import { MockOAuthClient } from "./MockOAuthClient";

interface MockOAuthPageProps {
  searchParams: Promise<{ provider?: string; state?: string }>;
}

export const metadata = {
  title: "Authorize Social Account | NextDrive Academy",
  description: "OAuth 2.0 social authorization simulator for local verification and testing.",
};

export default async function MockOAuthPage({ searchParams }: MockOAuthPageProps) {
  const { provider, state } = await searchParams;

  return (
    <MockOAuthClient
      provider={provider || "google"}
      stateParam={state || ""}
    />
  );
}
