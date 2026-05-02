"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/services/auth.service";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  type AddToCartInput,
  type UpdateCartItemInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const { user } = await requireAuth();

  return db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function addToCart(data: AddToCartInput) {
  const { user } = await requireAuth();
  const parsed = addToCartSchema.parse(data);

  // Check if item already exists
  const existingItem = await db.cartItem.findUnique({
    where: {
      userId_productId_size_color: {
        userId: user.id,
        productId: parsed.productId,
        size: parsed.size,
        color: parsed.color,
      },
    },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parsed.quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        userId: user.id,
        productId: parsed.productId,
        size: parsed.size,
        color: parsed.color,
        quantity: parsed.quantity,
      },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItemQuantity(data: UpdateCartItemInput) {
  const { user } = await requireAuth();
  const parsed = updateCartItemSchema.parse(data);

  // Ensure user owns this cart item
  const item = await db.cartItem.findUnique({
    where: { id: parsed.cartItemId },
  });

  if (!item || item.userId !== user.id) {
    throw new Error("Cart item not found or unauthorized");
  }

  await db.cartItem.update({
    where: { id: parsed.cartItemId },
    data: { quantity: parsed.quantity },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(data: { cartItemId: string }) {
  const { user } = await requireAuth();
  const parsed = removeCartItemSchema.parse(data);

  const item = await db.cartItem.findUnique({
    where: { id: parsed.cartItemId },
  });

  if (!item || item.userId !== user.id) {
    throw new Error("Cart item not found or unauthorized");
  }

  await db.cartItem.delete({
    where: { id: parsed.cartItemId },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const { user } = await requireAuth();

  await db.cartItem.deleteMany({
    where: { userId: user.id },
  });

  revalidatePath("/cart");
  return { success: true };
}
