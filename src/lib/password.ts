// lib/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Hash a plain-text password (for registration)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a plain-text password against a stored hash (for login)
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}