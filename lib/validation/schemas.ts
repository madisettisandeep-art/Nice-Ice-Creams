import { z } from "zod";

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export const CartLineSchema = z.object({
  productId: z.string().min(1).max(100),
  variantId: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(100),
});

export const OrderCheckoutSchema = z
  .object({
    customer_name: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().min(2, "Please enter your full name (at least 2 characters).").max(80)),
    customer_phone: z
      .string()
      .transform((val) => val.replace(/[^\d+\s-]/g, "").trim())
      .refine((val) => val.replace(/\D/g, "").length >= 10 && val.replace(/\D/g, "").length <= 15, {
        message: "Please enter a valid 10-digit mobile number.",
      }),
    order_type: z.enum(["pickup", "delivery", "party_enquiry"]),
    delivery_address: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v) : null)),
    preferred_time: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().min(2, "Please select or enter a preferred pickup/delivery time.").max(80)),
    notes: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v).slice(0, 500) : null)),
    party_date: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v) : null)),
    guest_count: z.number().int().min(1).max(5000).optional().nullable(),
    items: z.array(CartLineSchema).min(1, "Please add at least one product to your order."),
    idempotency_key: z.string().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.order_type === "delivery") {
      if (!data.delivery_address || data.delivery_address.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_address"],
          message: "Please provide a complete delivery address (minimum 8 characters) for home delivery.",
        });
      }
    }
  });

export const PartyBookingSchema = z
  .object({
    customer_name: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().min(2, "Please enter your full name.").max(80)),
    customer_phone: z
      .string()
      .transform((val) => val.replace(/[^\d+\s-]/g, "").trim())
      .refine((val) => val.replace(/\D/g, "").length >= 10 && val.replace(/\D/g, "").length <= 15, {
        message: "Please enter a valid 10-digit phone number.",
      }),
    event_type: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().min(2, "Please select an event type.").max(60)),
    event_date: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().min(4, "Please choose your event date.").max(40)),
    guest_count: z.coerce
      .number()
      .int()
      .min(10, "Party & bulk bookings require at least 10 estimated guests.")
      .max(10000, "Please contact us directly for events above 10,000 guests."),
    budget: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v).slice(0, 80) : null)),
    delivery_preference: z.enum(["delivery", "pickup"]),
    location: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v).slice(0, 250) : null)),
    order_preferences: z
      .array(z.string().transform(sanitizeText))
      .min(1, "Please select at least one desired flavour or dessert category."),
    notes: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (v ? sanitizeText(v).slice(0, 600) : null)),
    idempotency_key: z.string().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.delivery_preference === "delivery" && (!data.location || data.location.length < 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Please enter the event venue/location for delivery catering.",
      });
    }
  });

export const AdminProductInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().transform(sanitizeText).pipe(z.string().min(2).max(100)),
  category_id: z.string().min(2).max(60),
  description: z.string().transform(sanitizeText).pipe(z.string().min(5).max(600)),
  price: z.coerce.number().min(1, "Price must be at least ₹1").max(25000),
  image_url: z.string().optional(),
  cutout_url: z.string().optional(),
  availability: z.boolean().default(true),
  featured: z.boolean().default(false),
  seasonal: z.boolean().default(false),
  ingredients: z.array(z.string().transform(sanitizeText)).optional(),
  allergens: z.array(z.string().transform(sanitizeText)).optional(),
  variants: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().transform(sanitizeText).pipe(z.string().min(1)),
        price: z.coerce.number().min(1).max(25000),
        servingSize: z.string().optional(),
        available: z.boolean().default(true),
      })
    )
    .optional(),
});

