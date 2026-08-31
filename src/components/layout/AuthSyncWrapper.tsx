"use client";

import { useAuthSync } from "@/hooks/useAuthSync";

export default function AuthSyncWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthSync();

  return <>{children}</>;
}
