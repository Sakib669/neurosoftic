// lib/zod.ts
import { object, string } from "zod";

// Schema for login form validation
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Schema for registration (can be extended later)
export const signUpSchema = object({
  name: string({ required_error: "Name is required" }).min(1),
  email: string({ required_error: "Email is required" }).email(),
  password: string({ required_error: "Password is required" })
    .min(8)
    .max(32),
});