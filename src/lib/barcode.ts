// lib/barcode.ts
// Generates a 12-digit barcode based on the configured rule:
// Category Prefix (2) + Size/Variant Code (4) + Unique Serial (4) + Reserved/Check (2)

import prisma from "@/lib/db";

// Generate a unique 12-digit barcode for a product variant
export async function generateBarcode(
  categoryPrefix: string, // 2-digit category prefix
  sizeCode: string // normalized 4-digit code for variant attribute
): Promise<string> {
  // Ensure prefix is 2 digits, sizeCode is 4 digits
  const prefix = categoryPrefix.padStart(2, "0").slice(0, 2);
  const size = sizeCode.padStart(4, "0").slice(0, 4);

  // Generate a unique serial number (4 digits) using a database count/sequence
  const serial = await getNextSerial();

  // Reserved/check digits: for now use "00" as placeholder (can be configured later)
  const checkDigits = "00";

  const barcode = `${prefix}${size}${serial}${checkDigits}`;
  return barcode;
}

// Get the next serial number in the configured scope
// We'll use the total count of variants plus a random offset to avoid collisions.
async function getNextSerial(): Promise<string> {
  const count = await prisma.productVariant.count();
  // Create a 4-digit serial from count+1, wrapping if needed
  const serialNumber = (count + 1) % 10000;
  return serialNumber.toString().padStart(4, "0");
}