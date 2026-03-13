"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { applyCoupon, formatNGN } from "@/lib/utils";

interface CouponInputProps {
  subtotal: number;
  onApply: (code: string, discountAmount: number) => void;
}

export default function CouponInput({ subtotal, onApply }: CouponInputProps) {
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);

    const today = new Date().toISOString().split("T")[0];

    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("is_active", true)
      .gte("expiry_date", today)
      .single();

    if (!coupon) {
      setMessage("Invalid or expired coupon code.");
      setSuccess(false);
    } else {
      const discount = applyCoupon(subtotal, coupon.discount_type, coupon.discount_value);
      setMessage(`Coupon applied — you save ${formatNGN(discount)}`);
      setSuccess(true);
      onApply(coupon.code, discount);
    }

    setLoading(false);
  }

  return (
    <div className="coupon-input">
      <div className="coupon-row">
        <input
          type="text"
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={success}
        />
        <button
          onClick={handleApply}
          disabled={loading || success || !code.trim()}
          className="btn-secondary"
        >
          {loading ? "Checking..." : "Apply"}
        </button>
      </div>
      {message && (
        <p className={success ? "coupon-success" : "coupon-error"}>{message}</p>
      )}
    </div>
  );
}
