import type { DashboardReview } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { getInitials } from "./Helpers";


function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            s <= rating
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: DashboardReview }) {
  return (
    <div className="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {getInitials(review.student.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold">{review.student.name}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="line-clamp-2 pl-9 text-xs leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      )}
    </div>
  );
}

export function ReviewsCard({ reviews }: { reviews: DashboardReview[] }) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Recent Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Star className="h-7 w-7 opacity-25" />
            <p className="text-xs">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
            {reviews.length > 3 && (
              <p className="pt-1 text-center text-xs text-primary">
                +{reviews.length - 3} more reviews
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}