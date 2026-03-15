import { createClient } from "@/lib/supabase/server";
import type { AgeGroup, GenderTarget, ProductWithRelations } from "@/types/database";

interface ProductFilters {
  category_slug?: string;
  brand_slug?: string;
  gender_target?: GenderTarget;
  age_group?: AgeGroup;
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters.gender_target) query = query.eq("gender_target", filters.gender_target);
  if (filters.age_group) query = query.eq("age_group", filters.age_group);
  if (filters.limit) query = query.limit(filters.limit);
  if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(*),
      category:categories(*),
      images:product_images(* order: position asc),
      variants:product_variants(*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getBrands() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}
