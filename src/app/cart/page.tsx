import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/services/cart.actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { requireAuth } from "@/services/auth.service";

export default async function CartPage() {
  await requireAuth();
  const cartItems = await getCart();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                  {item.product.images?.[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 font-semibold">
                        {item.product.name}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <p className="text-primary font-medium">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-md border p-1">
                      <form
                        action={async () => {
                          "use server";
                          if (item.quantity > 1) {
                            await updateCartItemQuantity({
                              cartItemId: item.id,
                              quantity: item.quantity - 1,
                            });
                          }
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </form>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <form
                        action={async () => {
                          "use server";
                          await updateCartItemQuantity({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          });
                        }}
                      >
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </form>
                    </div>

                    <form
                      action={async () => {
                        "use server";
                        await removeFromCart({ cartItemId: item.id });
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-4">
            <div className="bg-card sticky top-24 rounded-lg border p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="mb-6 flex justify-between border-t pt-4 font-medium">
                <span>Total</span>
                <span className="text-lg">${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
