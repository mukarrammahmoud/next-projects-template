"use server";

import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/services/auth.service";
import {
  checkoutSchema,
  updateOrderStatusSchema,
  type CheckoutInput,
} from "@/lib/validations";
import { getCart } from "./cart.actions";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createOrder(data: CheckoutInput) {
  const { user } = await requireAuth();
  const parsed = checkoutSchema.parse(data);

  const cartItems = await getCart();

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  // Create order and clear cart in a transaction
  const order = await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        total: new Prisma.Decimal(total),
        shippingAddress: parsed.shippingAddress,
        phone: parsed.phone,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return newOrder;
  });

  revalidatePath("/cart");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return { success: true, orderId: order.id };
}

export async function getOrders() {
  const { user } = await requireAuth();

  return db.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin Actions ─────────────────────────────────────────────

export async function getAllOrders() {
  await requireAdmin();

  return db.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(data: {
  orderId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}) {
  await requireAdmin();
  const parsed = updateOrderStatusSchema.parse(data);

  await db.order.update({
    where: { id: parsed.orderId },
    data: { status: parsed.status },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}
