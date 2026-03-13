"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/database";

interface ProductImagesProps {
  images: ProductImage[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="product-images-placeholder" />;
  }

  return (
    <div className="product-images">
      <div className="product-images-main">
        <Image
          src={images[active].image_url}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="product-images-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`thumb-btn ${i === active ? "active" : ""}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.image_url}
                alt={`${name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
