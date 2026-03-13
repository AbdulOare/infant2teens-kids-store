import type { OrderStatus } from "@/types/database";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "badge-gray",
  paid:       "badge-blue",
  processing: "badge-yellow",
  shipped:    "badge-purple",
  delivered:  "badge-green",
  cancelled:  "badge-red",
  refunded:   "badge-orange",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    "Pending",
  paid:       "Paid",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
  refunded:   "Refunded",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`status-badge ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
