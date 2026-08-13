// lib/validators/product.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  quantity: z.number().int().min(0),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("ACTIVE"),
  mediaUrl: z.string().url().optional(), // primary image URL (we'll simplify)
});

export type CreateProductInput = z.infer<typeof createProductSchema>;