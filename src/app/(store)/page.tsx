import { getProducts, getCategories } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import HeroBanner from "@/components/layout/HeroBanner";
import CategoryBar from "@/components/layout/CategoryBar";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
  ]);

  return (
    <>
      <HeroBanner />
      <CategoryBar categories={categories} />
      <section className="container">
        <h2>New Arrivals</h2>
        <ProductGrid products={products} />
      </section>
    </>
  );
}
