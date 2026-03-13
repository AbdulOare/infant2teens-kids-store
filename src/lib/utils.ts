// Format a number as Nigerian Naira
export function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format a date string into a readable format
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

// Convert a string to a URL-safe slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Map age_group enum value to a human-readable label
export function ageGroupLabel(value: string): string {
  const labels: Record<string, string> = {
    infant: "Infant (0–12m)",
    toddler: "Toddler (1–3y)",
    kids: "Kids (4–11y)",
    teens: "Teens (12–17y)",
  };
  return labels[value] ?? value;
}

// Apply a coupon discount to a subtotal and return the discount amount
export function applyCoupon(
  subtotal: number,
  discountType: "percentage" | "fixed",
  discountValue: number
): number {
  if (discountType === "percentage") {
    return Math.min((subtotal * discountValue) / 100, subtotal);
  }
  return Math.min(discountValue, subtotal);
}
