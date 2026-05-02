import { getProducts } from "@/services/product.actions";
import { getFavorites } from "@/services/favorite.actions";
import { ProductCard } from "@/components/modules/products/ProductCard";
import { getCurrentUser } from "@/services/auth.service";
import { Suspense } from "react";

async function HomeContent() {
  const [products, user] = await Promise.all([getProducts(), getCurrentUser()]);

  let userFavorites = new Set<string>();

  if (user) {
    const favorites = await getFavorites();
    userFavorites = new Set(favorites.map((f) => f.productId));
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavoritedInitially={userFavorites.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            No products found
          </h2>
          <p className="mt-2 text-zinc-500">
            Check back later for new arrivals.
          </p>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              New Arrivals
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Checkout our latest collection of premium clothing.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="text-muted-foreground py-24 text-center">
              Loading products...
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      </main>
    </div>
  );
}
