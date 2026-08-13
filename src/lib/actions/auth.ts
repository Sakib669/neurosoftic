// lib/actions/auth.ts
"use server";

import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/zod";
import { z } from "zod";
import prisma from "../db";

// Server action for user registration
export async function registerUser(formData: FormData) {
  // Validate input
  const parsed = signUpSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
  });
  if (existing) {
    throw new Error("Email already in use");
  }

  // Hash the password
  const passwordHash = await hashPassword(parsed.password);

  // Create user and customer profile in a transaction
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash,
      role: "CUSTOMER",
      customer: {
        create: {}, // create empty customer profile
      },
    },
  });

  return { success: true, userId: user.id };
}
