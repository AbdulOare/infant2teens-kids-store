"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { AgeGroup, GenderTarget } from "@/types/database";
import { ageGroupLabel } from "@/lib/utils";

const GENDERS: { label: string; value: GenderTarget }[] = [
  { label: "Boys", value: "boys" },
  { label: "Girls", value: "girls" },
  { label: "Unisex", value: "unisex" },
];

const AGE_GROUPS: AgeGroup[] = ["infant", "toddler", "kids", "teens"];

interface FilterSidebarProps {
  activeGender?: GenderTarget;
  activeAge?: AgeGroup;
}

export default function FilterSidebar({ activeGender, activeAge }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-group">
        <p className="filter-label">Gender</p>
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() =>
              setFilter("gender", activeGender === g.value ? null : g.value)
            }
            className={`filter-option ${activeGender === g.value ? "active" : ""}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-label">Age group</p>
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            onClick={() =>
              setFilter("age", activeAge === age ? null : age)
            }
            className={`filter-option ${activeAge === age ? "active" : ""}`}
          >
            {ageGroupLabel(age)}
          </button>
        ))}
      </div>

      {(activeGender || activeAge) && (
        <button
          onClick={() => router.push(pathname)}
          className="filter-clear"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}
