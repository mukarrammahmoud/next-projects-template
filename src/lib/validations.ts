import { z } from "zod";

// ─── Auth Schemas ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── Product Schemas ──────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  category: z.enum([
    "TOPS",
    "BOTTOMS",
    "DRESSES",
    "OUTERWEAR",
    "ACTIVEWEAR",
    "ACCESSORIES",
  ]),
  sizes: z
    .array(z.enum(["XS", "S", "M", "L", "XL", "XXL"]))
    .min(1, "Select at least one size"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  featured: z.boolean().default(false),
});

// ─── Cart Schemas ──────────────────────────────────────────────

export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  color: z.string().min(1),
  quantity: z.coerce.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.coerce.number().int().positive(),
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
});

// ─── Order Schemas ──────────────────────────────────────────────

export const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .min(10, "Please provide a full shipping address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// ─── Type Exports ──────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
