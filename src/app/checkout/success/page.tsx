import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/services/auth.service";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  await requireAuth();
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <CheckCircle className="mb-6 h-24 w-24 text-green-500" />
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-8 text-xl">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {orderId && (
        <div className="bg-muted mb-8 rounded-lg px-6 py-4">
          <p className="text-muted-foreground mb-1 text-sm">Order Reference</p>
          <p className="font-mono font-medium">{orderId}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/orders">
          <Button size="lg">View My Orders</Button>
        </Link>
      </div>
    </div>
  );
}
