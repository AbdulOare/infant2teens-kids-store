import { getUserOrders } from "@/lib/orders";
import { formatNGN, formatDate } from "@/lib/utils";
import Link from "next/link";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <div className="container orders-empty">
        <h1>No orders yet</h1>
        <p>When you place an order it will appear here.</p>
        <Link href="/browse">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="order-card"
          >
            <div className="order-card-left">
              <span className="order-date">{formatDate(order.placed_at)}</span>
              <span className="order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
              <span className="order-items">
                {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="order-card-right">
              <OrderStatusBadge status={order.status} />
              <span className="order-total">{formatNGN(order.total_ngn)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
