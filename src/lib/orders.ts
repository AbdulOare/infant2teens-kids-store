"use server";

import { createClient } from "@/lib/supabase/server";
import { applyCoupon } from "@/lib/utils";
import type { CartItem } from "@/types/database";

interface PlaceOrderInput {
  addressId: string;
  cartItems: CartItem[];
  couponCode?: string;
  deliveryFee: number;
}

export async function placeOrder(input: PlaceOrderInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const subtotal = input.cartItems.reduce(
    (sum, i) => sum + i.variant.price_ngn * i.quantity,
    0
  );

  // Validate coupon if provided
  let couponId: string | null = null;
  let discountAmount = 0;

  if (input.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", input.couponCode.toUpperCase())
      .eq("is_active", true)
      .gte("expiry_date", new Date().toISOString().split("T")[0])
      .single();

    if (coupon) {
      couponId = coupon.id;
      discountAmount = applyCoupon(subtotal, coupon.discount_type, coupon.discount_value);
    }
  }

  const total = subtotal - discountAmount + input.deliveryFee;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      address_id: input.addressId,
      coupon_id: couponId,
      status: "pending",
      subtotal_ngn: subtotal,
      discount_amount: discountAmount,
      delivery_fee: input.deliveryFee,
      total_ngn: total,
    })
    .select()
    .single();

  if (orderError || !order) throw new Error(orderError?.message ?? "Failed to create order");

  // Insert order items
  const orderItems = input.cartItems.map((item) => ({
    order_id: order.id,
    variant_id: item.variant.id,
    quantity: item.quantity,
    unit_price_ngn: item.variant.price_ngn,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  return order;
}

export async function confirmPayment(orderId: string, reference: string, amountNgn: number) {
  const supabase = await createClient();

  // Record the payment
  await supabase.from("payments").insert({
    order_id: orderId,
    provider: "paystack",
    reference,
    status: "succeeded",
    amount_ngn: amountNgn,
    paid_at: new Date().toISOString(),
  });

  // Update order status
  await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);
}

export async function getUserOrders() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
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
    .eq("user_id", user.id)
    .order("placed_at", { ascending: false });

  return data ?? [];
}
