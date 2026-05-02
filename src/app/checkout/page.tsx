import { getCart } from "@/services/cart.actions";
import { CheckoutForm } from "@/components/modules/checkout/CheckoutForm";
import { requireAuth } from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage() {
  await requireAuth();
  const cartItems = await getCart();

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          You have no items to checkout.
        </p>
        <Link href="/">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CheckoutForm total={total} />
        </div>

        <div className="lg:col-span-5">
          <div className="bg-card sticky top-24 rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">Order Details</h2>

            <div className="mb-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 text-sm">
                  <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <p className="line-clamp-1 font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium">
                        $
                        {(Number(item.product.price) * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4 font-medium">
              <span>Total</span>
              <span className="text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
