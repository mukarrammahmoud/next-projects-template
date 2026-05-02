import { getOrders } from "@/services/order.actions";
import { requireAuth } from "@/services/auth.service";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UserOrdersPage() {
  await requireAuth();
  const orders = await getOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-card rounded-lg border py-12 text-center">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card overflow-hidden rounded-lg border"
            >
              <div className="bg-muted flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center sm:p-6">
                <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase">
                      Order Placed
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase">
                      Total
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase">
                      Order #
                    </p>
                    <p className="mt-1 font-mono text-sm">{order.id}</p>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      order.status === "DELIVERED" ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6 p-4 sm:p-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border sm:h-24 sm:w-24">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="line-clamp-1 text-base font-medium">
                            {item.product.name}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
