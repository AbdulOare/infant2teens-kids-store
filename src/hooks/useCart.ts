"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, ProductVariant, Product } from "@/types/database";

const CART_KEY = "kidstore_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  };

  const addItem = useCallback(
    (variant: ProductVariant, product: Product, image_url: string | null) => {
      const current = readCart();
      const existing = current.find((i) => i.variant.id === variant.id);
      if (existing) {
        persist(
          current.map((i) =>
            i.variant.id === variant.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        );
      } else {
        persist([...current, { variant, product, image_url, quantity: 1 }]);
      }
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    persist(readCart().filter((i) => i.variant.id !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1) return;
    persist(
      readCart().map((i) =>
        i.variant.id === variantId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => persist([]), []);

  const subtotal = items.reduce(
    (sum, i) => sum + i.variant.price_ngn * i.quantity,
    0
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  };
}
