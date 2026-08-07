import type { Review } from "@/lib/data";
import StarRating from "./StarRating";

export default function ReviewsList({ reviews, rating }: { reviews: Review[]; rating: number }) {
  return (
    <section className="mt-14">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="section-heading">Recenze</h2>
        <StarRating rating={rating} size={18} />
        <span className="text-sm text-bark/60">{rating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "recenze" : "recenzí"}</span>
      </div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <article key={review.id} className="border-b border-forest/10 pb-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-forest">{review.author}</p>
              <StarRating rating={review.rating} size={14} />
            </div>
            <p className="text-xs text-bark/50 mt-1">{new Date(review.date).toLocaleDateString("cs-CZ")}</p>
            <p className="text-sm text-bark/80 mt-2 leading-relaxed">{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
