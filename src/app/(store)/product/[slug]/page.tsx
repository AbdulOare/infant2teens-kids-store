/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductImages from "@/components/product/ProductImages";
import VariantPicker from "@/components/product/VariantPicker";
import ReviewList from "@/components/reviews/ReviewList";
import type { Metadata } from "next";

export async function generateMetadata(props: any): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage(props: any) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container product-layout">
      <ProductImages images={product.images} name={product.name} />
      <div className="product-info">
        {product.brand && <p className="brand-name">{product.brand.name}</p>}
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <VariantPicker product={product} variants={product.variants} />
      </div>
      <ReviewList productId={product.id} />
    </div>
  );
}
