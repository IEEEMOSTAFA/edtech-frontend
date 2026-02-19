"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, MyBooking, CreateReviewPayload } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ================= STAR RATING =================
const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors ${
            star <= value ? "text-yellow-400" : "text-muted-foreground"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// ================= COMPONENT =================
export default function LeaveReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<MyBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ Fetch the booking details to know tutorId
  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    apiFetch<ApiResponse<MyBooking>>(`/api/bookings/${bookingId}`)
      .then((res) => setBooking(res.data))
      .catch(() => setError("Failed to load booking"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!booking) return;

    setSubmitting(true);
    setError(null);

    const payload: CreateReviewPayload = {
      bookingId: booking.id,
      // NOTE: The backend will resolve tutorId from bookingId
      // So we pass an empty string here
      tutorId: booking.tutor.id,
      rating,
      comment,
    };

    try {
      await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/bookings"), 1500);
    } catch {
      setError("Failed to submit review. You may have already reviewed this session.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (error && !booking) return <p className="p-6 text-destructive">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Leave a Review</h1>

      {booking && (
        <p className="text-muted-foreground mb-6">
          Session with <span className="font-medium text-foreground">{booking.tutor.name}</span>
        </p>
      )}

      {success ? (
        <p className="text-green-600 font-medium">
          ✅ Review submitted! Redirecting...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Rating */}
          <div>
            <Label>Rating</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </div>
  );
}