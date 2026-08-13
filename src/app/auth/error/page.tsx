// app/auth/error/page.tsx
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-error">Authentication Error</h1>
        <p className="mt-2 text-on-surface-variant">
          Something went wrong during authentication.
        </p>
        <Link href="/auth/login" className="mt-4 inline-block text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}