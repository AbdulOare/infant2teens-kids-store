import { createClient } from "@/lib/supabase/server";
import { formatNGN, formatDate } from "@/lib/utils";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, user:users(full_name, email), address:addresses(city, state)")
    .order("placed_at", { ascending: false });

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Location</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>#{order.id.slice(0, 8).toUpperCase()}</td>
              <td>
                <p style={{ fontWeight: 600 }}>{(order.user as any)?.full_name}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{(order.user as any)?.email}</p>
              </td>
              <td>{(order.address as any)?.city}, {(order.address as any)?.state}</td>
              <td><OrderStatusBadge status={order.status} /></td>
              <td>{formatNGN(order.total_ngn)}</td>
              <td>{formatDate(order.placed_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
