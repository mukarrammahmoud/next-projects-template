"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleFavorite } from "@/services/favorite.actions";
import { addToCart } from "@/services/cart.actions";
import { type Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
  isFavoritedInitially?: boolean;
}

export function ProductCard({
  product,
  isFavoritedInitially = false,
}: ProductCardProps) {
  const [isPendingFav, startTransitionFav] = useTransition();
  const [isPendingCart, startTransitionCart] = useTransition();

  const [optimisticFavorited, addOptimisticFavorite] = useOptimistic(
    isFavoritedInitially,
    (state, newFavorite: boolean) => newFavorite,
  );

  const handleToggleFavorite = () => {
    startTransitionFav(async () => {
      addOptimisticFavorite(!optimisticFavorited);
      try {
        await toggleFavorite(product.id);
      } catch (error) {
        toast.error(
          (error as Error)?.message || "Please login to save favorites.",
        );
      }
    });
  };

  const handleAddToCart = () => {
    startTransitionCart(async () => {
      try {
        await addToCart({
          productId: product.id,
          size: product.sizes[0] || "M", // Default to first available size
          color: product.colors[0] || "Default", // Default to first available color
          quantity: 1,
        });
        toast.success("Added to cart");
      } catch (error) {
        toast.error(
          (error as Error)?.message || "Please login to add to cart.",
        );
      }
    });
  };

  return (
    <div className="group bg-card text-card-foreground relative rounded-lg border shadow-sm transition-all hover:shadow-md">
      <div className="bg-secondary relative aspect-square overflow-hidden rounded-t-lg">
        <Link href={`/product/${product.id}`}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-full items-center justify-center">
              No Image
            </div>
          )}
        </Link>
        <button
          onClick={handleToggleFavorite}
          disabled={isPendingFav}
          className="absolute top-3 right-3 rounded-full bg-white/80 p-2 text-zinc-900 backdrop-blur-sm transition-all hover:scale-110 dark:bg-black/80 dark:text-zinc-50"
          aria-label={
            optimisticFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`h-5 w-5 ${optimisticFavorited ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-primary font-medium">
            ${Number(product.price).toFixed(2)}
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isPendingCart}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
