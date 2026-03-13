"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="cart-icon" aria-label={`Bag (${totalItems} items)`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {totalItems > 0 && (
        <span className="cart-badge">{totalItems}</span>
      )}
    </Link>
  );
}
