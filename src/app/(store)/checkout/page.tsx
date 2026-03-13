"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatNGN, applyCoupon } from "@/lib/utils";
import { openPaystackModal, generateReference } from "@/lib/paystack";
import { placeOrder, confirmPayment } from "@/lib/orders";
import { useRouter } from "next/navigation";
import AddressPicker from "@/components/checkout/AddressPicker";
import CouponInput from "@/components/checkout/CouponInput";

const DELIVERY_FEE = 3500;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = subtotal - discountAmount + DELIVERY_FEE;

  async function handleCheckout() {
    if (!addressId) {
      setError("Please select a delivery address.");
      return;
    }
    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await placeOrder({
        addressId,
        cartItems: items,
        couponCode: couponCode || undefined,
        deliveryFee: DELIVERY_FEE,
      });

      const reference = generateReference();

      openPaystackModal({
        email: "", // populated from user session in real implementation
        amountNgn: total,
        reference,
        onSuccess: async (ref) => {
          await confirmPayment(order.id, ref, total);
          clearCart();
          router.push(`/orders/${order.id}?success=true`);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="container checkout-layout">
      <div className="checkout-form">
        <h1>Checkout</h1>

        <section>
          <h2>Delivery address</h2>
          <AddressPicker selected={addressId} onSelect={setAddressId} />
        </section>

        <section>
          <h2>Coupon</h2>
          <CouponInput
            subtotal={subtotal}
            onApply={(code, discount) => {
              setCouponCode(code);
              setDiscountAmount(discount);
            }}
          />
        </section>
      </div>

      <aside className="checkout-summary">
        <h2>Order total</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatNGN(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>- {formatNGN(discountAmount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Delivery</span>
          <span>{formatNGN(DELIVERY_FEE)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatNGN(total)}</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          className="btn-primary"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay ${formatNGN(total)}`}
        </button>

        <p className="secure-note">
          Secured by Paystack. Your card details are never stored.
        </p>
      </aside>
    </div>
  );
}
