// components/shared/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-on-surface/70 hover:text-primary transition-colors"
    >
      Sign Out
    </button>
  );
}