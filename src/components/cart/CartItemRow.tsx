import { formatNGN } from "@/lib/utils";
import type { CartItem } from "@/types/database";
import Image from "next/image";

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}

export default function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="cart-item-placeholder" />
        )}
      </div>

      <div className="cart-item-details">
        <p className="cart-item-name">{item.product.name}</p>
        <p className="cart-item-meta">
          Size: {item.variant.size}
          {item.variant.color && ` · ${item.variant.color}`}
        </p>
        <p className="cart-item-price">{formatNGN(item.variant.price_ngn)}</p>
      </div>

      <div className="cart-item-controls">
        <div className="qty-control">
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.variant.stock_qty}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <p className="cart-item-subtotal">
          {formatNGN(item.variant.price_ngn * item.quantity)}
        </p>
        <button onClick={onRemove} className="cart-item-remove" aria-label="Remove item">
          Remove
        </button>
      </div>
    </div>
  );
}
