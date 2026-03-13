import Link from "next/link";
import type { Category } from "@/types/database";

const AGE_GROUPS = [
  { label: "Infant", value: "infant", sub: "0–12m" },
  { label: "Toddler", value: "toddler", sub: "1–3y" },
  { label: "Kids", value: "kids", sub: "4–11y" },
  { label: "Teens", value: "teens", sub: "12–17y" },
];

interface CategoryBarProps {
  categories: Category[];
}

export default function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <div className="category-bar">
      {AGE_GROUPS.map((group) => (
        <Link
          key={group.value}
          href={`/browse?age=${group.value}`}
          className="category-pill"
        >
          <span className="category-label">{group.label}</span>
          <span className="category-sub">{group.sub}</span>
        </Link>
      ))}
    </div>
  );
}
