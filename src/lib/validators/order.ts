// lib/validators/order.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().nullable().optional().transform((val) => val ?? undefined),
  city: z.string().min(1),
  state: z.string().nullable().optional().transform((val) => val ?? undefined),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  paymentMethod: z.enum(["cod", "online", "partial"]),
  notes: z.string().nullable().optional().transform((val) => val ?? undefined),
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;