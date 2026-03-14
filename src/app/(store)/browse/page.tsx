import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar";
import type { AgeGroup, GenderTarget } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const params = await searchParams;
  const gender = params?.gender as GenderTarget | undefined;
  const age = params?.age as AgeGroup | undefined;

  const products = await getProducts({
    gender_target: gender,
    age_group: age,
  });

  return (
    <div className="container browse-layout">
      <FilterSidebar activeGender={gender} activeAge={age} />
      <section>
        <p>{products.length} products</p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
