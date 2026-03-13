import Link from "next/link";
import Image from "next/image";
import { formatNGN } from "@/lib/utils";
import type { ProductWithRelations } from "@/types/database";

interface ProductGridProps {
  products: ProductWithRelations[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="no-products">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const coverImage = product.images?.[0]?.image_url ?? null;
        const lowestPrice = product.variants?.length
          ? Math.min(...product.variants.map((v) => v.price_ngn))
          : null;

        return (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="product-card"
          >
            <div className="product-card-image">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="product-card-placeholder" />
              )}
            </div>
            <div className="product-card-info">
              {product.brand && (
                <p className="product-card-brand">{product.brand.name}</p>
              )}
              <p className="product-card-name">{product.name}</p>
              {lowestPrice !== null && (
                <p className="product-card-price">
                  From {formatNGN(lowestPrice)}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
