// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Call server action to create user
      await registerUser(formData);
      // After successful registration, sign in automatically
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: true,
        callbackUrl: "/",
      });
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-primary">Create Account</h1>
        {error && (
          <div className="mb-4 rounded bg-error-container p-3 text-sm text-on-error-container">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded border border-outline-variant px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded border border-outline-variant px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded border border-outline-variant px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2 text-on-primary transition hover:bg-primary-container disabled:opacity-50
            text-white"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}