// lib/auth.ts
import NextAuth, { type DefaultSession } from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { signInSchema } from "@/lib/zod";
import prisma from "@/lib/db";
import { verifyPassword } from "@/lib/hash";

// Extend session and user types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input using Zod
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          // If no user or no password hash (social login users), fail
          if (!user?.passwordHash) return null;

          // Verify password
          const isValid = await verifyPassword(password, user.passwordHash);
          if (!isValid) return null;

          // Return user object (becomes JWT payload)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return null to indicate invalid credentials
            return null;
          }
          // Re-throw other unexpected errors
          throw error;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});