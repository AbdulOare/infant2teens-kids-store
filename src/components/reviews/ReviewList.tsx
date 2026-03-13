import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

interface ReviewListProps {
  productId: string;
}

export default async function ReviewList({ productId }: ReviewListProps) {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, user:users(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (!reviews || reviews.length === 0) {
    return (
      <section className="reviews">
        <h2>Reviews</h2>
        <p>No reviews yet. Be the first to review this product.</p>
      </section>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="reviews">
      <div className="reviews-header">
        <h2>Reviews ({reviews.length})</h2>
        <span className="avg-rating">
          {avgRating.toFixed(1)} / 5
        </span>
      </div>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-meta">
              <span className="reviewer-name">{(review.user as any)?.full_name ?? "Customer"}</span>
              <span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              <span className="review-date">{formatDate(review.created_at)}</span>
            </div>
            {review.comment && <p className="review-comment">{review.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
