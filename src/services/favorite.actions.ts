"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/services/auth.service";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  const { user } = await requireAuth();

  const existing = await db.favorite.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existing) {
    await db.favorite.delete({
      where: { id: existing.id },
    });
  } else {
    await db.favorite.create({
      data: {
        userId: user.id,
        productId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/favorites");
  return { success: true, isFavorited: !existing };
}

export async function getFavorites() {
  const { user } = await requireAuth();

  return db.favorite.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
}
