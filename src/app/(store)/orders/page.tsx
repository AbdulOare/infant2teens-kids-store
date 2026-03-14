/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatNGN, formatDate } from "@/lib/utils";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details" };

export default async function OrderPage(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      address:addresses(*),
      payment:payments(*),
      items:order_items(
        *,
        variant:product_variants(
          *,
          product:products(*, images:product_images(* order: position asc))
        )
      )
    `)
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  return (
    <div className="container order-detail">
      {searchParams?.success && (
        <div className="success-banner">
          Payment confirmed. Your order is being processed.
        </div>
      )}

      <div className="order-header">
        <div>
          <h1>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p>{formatDate(order.placed_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.tracking_number && (
        <div className="tracking-card">
          <p>Courier: {order.courier}</p>
          <p>Tracking: {order.tracking_number}</p>
          {order.shipped_at && <p>Shipped: {formatDate(order.shipped_at)}</p>}
          {order.delivered_at && <p>Delivered: {formatDate(order.delivered_at)}</p>}
        </div>
      )}

      <section>
        <h2>Items</h2>
        {order.items?.map((item: any) => (
          <div key={item.id} className="order-item-row">
            <div className="order-item-info">
              <p className="item-name">{item.variant?.product?.name}</p>
              <p className="item-meta">
                Size: {item.variant?.size}
                {item.variant?.color && ` · ${item.variant.color}`}
              </p>
              <p>Qty: {item.quantity}</p>
            </div>
            <p>{formatNGN(item.unit_price_ngn * item.quantity)}</p>
          </div>
        ))}
      </section>

      <section className="order-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatNGN(order.subtotal_ngn)}</span>
        </div>
        {order.discount_amount > 0 && (
          <div className="summary-row">
            <span>Discount</span>
            <span>- {formatNGN(order.discount_amount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Delivery</span>
          <span>{formatNGN(order.delivery_fee)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatNGN(order.total_ngn)}</span>
        </div>
      </section>

      <section>
        <h2>Delivered to</h2>
        <p>{order.address?.street}</p>
        <p>{order.address?.city}, {order.address?.state}</p>
      </section>
    </div>
  );
}
