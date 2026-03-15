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
          product:products(*, images:product_images(*))
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
          <h1>Order #{(order as any).id.slice(0, 8).toUpperCase()}</h1>
          <p>{formatDate((order as any).placed_at)}</p>
        </div>
        <OrderStatusBadge status={(order as any).status} />
      </div>

      {(order as any).tracking_number && (
        <div className="tracking-card">
          <p>Courier: {(order as any).courier}</p>
          <p>Tracking: {(order as any).tracking_number}</p>
          {(order as any).shipped_at && <p>Shipped: {formatDate((order as any).shipped_at)}</p>}
          {(order as any).delivered_at && <p>Delivered: {formatDate((order as any).delivered_at)}</p>}
        </div>
      )}

      <section>
        <h2>Items</h2>
        {(order as any).items?.map((item: any) => (
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
          <span>{formatNGN((order as any).subtotal_ngn)}</span>
        </div>
        {(order as any).discount_amount > 0 && (
          <div className="summary-row">
            <span>Discount</span>
            <span>- {formatNGN((order as any).discount_amount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Delivery</span>
          <span>{formatNGN((order as any).delivery_fee)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatNGN((order as any).total_ngn)}</span>
        </div>
      </section>

      <section>
        <h2>Delivered to</h2>
        <p>{(order as any).address?.street}</p>
        <p>{(order as any).address?.city}, {(order as any).address?.state}</p>
      </section>
    </div>
  );
}
