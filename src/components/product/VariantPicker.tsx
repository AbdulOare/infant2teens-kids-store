"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatNGN } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types/database";

interface VariantPickerProps {
  product: Product;
  variants: ProductVariant[];
}

export default function VariantPicker({ product, variants }: VariantPickerProps) {
  const { addItem } = useCart();

  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length > 0 ? null : undefined as any
  );
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find(
    (v) =>
      v.size === selectedSize &&
      (colors.length === 0 || v.color === selectedColor)
  );

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem(selectedVariant, product, null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="variant-picker">
      {/* Size */}
      <div className="variant-group">
        <p className="variant-label">Size</p>
        <div className="variant-options">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`variant-btn ${selectedSize === size ? "active" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      {colors.length > 0 && (
        <div className="variant-group">
          <p className="variant-label">Color</p>
          <div className="variant-options">
            {colors.map((color) => (
              <button
                key={color!}
                onClick={() => setSelectedColor(color!)}
                className={`variant-btn ${selectedColor === color ? "active" : ""}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      {selectedVariant && (
        <p className="variant-price">{formatNGN(selectedVariant.price_ngn)}</p>
      )}

      {/* Stock warning */}
      {selectedVariant && selectedVariant.stock_qty < 5 && selectedVariant.stock_qty > 0 && (
        <p className="stock-warning">Only {selectedVariant.stock_qty} left</p>
      )}
      {selectedVariant && selectedVariant.stock_qty === 0 && (
        <p className="out-of-stock">Out of stock</p>
      )}

      <button
        className="btn-primary add-to-cart"
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock_qty === 0}
      >
        {added ? "Added to bag!" : "Add to bag"}
      </button>
    </div>
  );
}
