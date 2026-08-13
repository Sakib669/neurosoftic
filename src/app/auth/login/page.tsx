// app/auth/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      // signIn will redirect on success, or throw on error
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: true,
        callbackUrl: "/", // or the original destination
      });
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-primary">Welcome Back</h1>
        {error && (
          <div className="mb-4 rounded bg-error-container p-3 text-sm text-on-error-container">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded border border-outline-variant px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2 text-on-primary transition hover:bg-primary-container disabled:opacity-50
            text-white"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}