import { createClient } from "@/lib/supabase/server";
import { formatNGN } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: totalProducts },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("orders")
      .select("id, status, total_ngn, placed_at")
      .order("placed_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <p className="stat-label">Total orders</p>
          <p className="stat-value">{totalOrders ?? 0}</p>
        </div>
        <div className="admin-stat">
          <p className="stat-label">Active products</p>
          <p className="stat-value">{totalProducts ?? 0}</p>
        </div>
      </div>

      <section>
        <h2>Recent orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders?.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8).toUpperCase()}</td>
                <td>{order.status}</td>
                <td>{formatNGN(order.total_ngn)}</td>
                <td>{new Date(order.placed_at).toLocaleDateString("en-NG")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
