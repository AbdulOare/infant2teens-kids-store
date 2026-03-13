import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar";
import type { AgeGroup, GenderTarget } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

interface BrowsePageProps {
  searchParams: Promise<{
    gender?: GenderTarget;
    age?: AgeGroup;
    category?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { gender, age } = await searchParams;

  const products = await getProducts({
    gender_target: gender,
    age_group: age,
  });

  return (
    <div className="container browse-layout">
      <FilterSidebar
        activeGender={gender}
        activeAge={age}
      />
      <section>
        <p>{products.length} products</p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
