"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/services/auth.service";
import { productSchema, type ProductInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { type Prisma, type Category } from "@prisma/client";

export async function createProduct(data: ProductInput) {
  await requireAdmin();

  const parsed = productSchema.parse(data);

  const product = await db.product.create({
    data: {
      ...parsed,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, product };
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  await requireAdmin();

  const product = await db.product.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  return { success: true, product };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}
type ProductsQuery = {
  category?: string;
  featured?: boolean;
  archived?: boolean;
};
export async function getProducts(options?: ProductsQuery) {
  const where: Prisma.ProductWhereInput = {};

  if (options?.archived !== undefined) {
    where.archived = options.archived;
  } else {
    where.archived = false; // default to non-archived
  }

  if (options?.category) {
    where.category = options.category as Category;
  }

  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }

  return db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
  });
}
