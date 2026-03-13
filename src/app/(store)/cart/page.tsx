"use client";

import { useCart } from "@/hooks/useCart";
import { formatNGN } from "@/lib/utils";
import Link from "next/link";
import CartItemRow from "@/components/cart/CartItemRow";

export default function CartPage() {
  const { items, subtotal, totalItems, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Your bag is empty</h1>
        <p>Add some items to get started.</p>
        <Link href="/browse">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container cart-layout">
      <div className="cart-items">
        <h1>Your bag ({totalItems})</h1>
        {items.map((item) => (
          <CartItemRow
            key={item.variant.id}
            item={item}
            onRemove={() => removeItem(item.variant.id)}
            onQuantityChange={(qty) => updateQuantity(item.variant.id, qty)}
          />
        ))}
        <button onClick={clearCart} className="btn-ghost">Clear bag</button>
      </div>

      <aside className="cart-summary">
        <h2>Order summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatNGN(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </div>
        <Link href="/checkout" className="btn-primary">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
