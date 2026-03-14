import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductImages from "@/components/product/ProductImages";
import VariantPicker from "@/components/product/VariantPicker";
import ReviewList from "@/components/reviews/ReviewList";
import type { Metadata } from "next";
import { cache } from "react";

interface ProductPageProps {
  params: { slug: string };
}

const getCachedProduct = cache(async (slug: string) => {
  return getProductBySlug(slug);
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getCachedProduct(params.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getCachedProduct(params.slug);

  if (!product) notFound();

  return (
    <div className="container product-layout">
      <ProductImages images={product.images ?? []} name={product.name} />

      <div className="product-info">
        {product.brand && <p className="brand-name">{product.brand.name}</p>}
        <h1>{product.name}</h1>
        <p>{product.description}</p>

        <VariantPicker variants={product.variants} />
      </div>

      <ReviewList productId={product.id} />
    </div>
  );
}
