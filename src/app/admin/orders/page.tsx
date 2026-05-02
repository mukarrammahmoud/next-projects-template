import { getAllOrders } from "@/services/order.actions";
import { OrdersTable } from "@/components/modules/admin/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store&apos;s orders and track fulfillments.
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <OrdersTable data={orders} />
      </div>
    </div>
  );
}
