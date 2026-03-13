import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar";
import type { AgeGroup, GenderTarget } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

interface BrowsePageProps {
  searchParams: {
    gender?: GenderTarget;
    age?: AgeGroup;
    category?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const products = await getProducts({
    gender_target: searchParams.gender,
    age_group: searchParams.age,
  });

  return (
    <div className="container browse-layout">
      <FilterSidebar
        activeGender={searchParams.gender}
        activeAge={searchParams.age}
      />
      <section>
        <p>{products.length} products</p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
