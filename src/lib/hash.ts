// lib/hash.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Hash a plain-text password before storing in DB
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a plain-text password against a hashed password
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}