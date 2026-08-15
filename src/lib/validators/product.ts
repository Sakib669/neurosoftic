// lib/validators/product.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional().transform((v) => v ?? undefined),
  shortDescription: z.string().nullable().optional().transform((v) => v ?? undefined),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().positive().max(99999999.99, "Price is too large"),   // ✅ max check
  salePrice: z.number().positive().max(99999999.99).nullable().optional(),
  costPrice: z.number().positive().max(99999999.99).nullable().optional(),
  quantity: z.number().int().min(0),
  sku: z.string().min(1),
  barcode: z.string().nullable().optional().transform((v) => v ?? undefined),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("ACTIVE"),
  mediaUrl: z.string().url().nullable().optional().transform((v) => v ?? undefined),

  // Car-specific fields
  year: z.string().nullable().optional(),
  mileage: z.string().nullable().optional(),
  bodyType: z.string().nullable().optional(),
  fuelType: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  driveType: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;