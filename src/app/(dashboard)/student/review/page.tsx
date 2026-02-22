"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, MyBooking } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send, Loader2 } from "lucide-react";

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hovered || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="text-sm font-medium text-primary">
          {labels[hovered || value]}
        </p>
      )}
    </div>
  );
};

export default function LeaveReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");
  const reviewId = searchParams.get("reviewId");   // ← edit mode এর জন্য
  const isEditMode = !!reviewId;                   // reviewId থাকলে edit mode

  const [booking, setBooking] = useState<MyBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Edit mode: আগের review data load করি
        if (isEditMode && reviewId) {
          const res = await apiFetch<ApiResponse<{ rating: number; comment?: string }>>(
            `/api/reviews/${reviewId}`
          );
          setRating(res.data.rating);
          setComment(res.data.comment ?? "");
          setLoading(false);
          return;
        }

        // Create mode: booking data load করি
        if (!bookingId) {
          setError("No booking ID provided");
          setLoading(false);
          return;
        }

        const res = await apiFetch<ApiResponse<MyBooking>>(
          `/api/bookings/${bookingId}`
        );
        setBooking(res.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId, reviewId, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating"); return; }

    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        // ✅ Edit mode: PATCH request
        await apiFetch(`/api/reviews/${reviewId}`, {
          method: "PATCH",
          body: JSON.stringify({ rating, comment }),
        });
      } else {
        // ✅ Create mode: POST request
        if (!booking) return;
        await apiFetch("/api/reviews", {
          method: "POST",
          body: JSON.stringify({
            bookingId: booking.id,
            tutorId: booking.tutor.id,
            rating,
            comment,
          }),
        });
      }

      setSuccess(true);
      setTimeout(() => router.push("/student/bookings"), 1500);
    } catch {
      setError(
        isEditMode
          ? "Failed to update review."
          : "Failed to submit review. You may have already reviewed this session."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !booking && !isEditMode) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <Button variant="outline" onClick={() => router.push("/student/bookings")}>
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Session Feedback
        </p>
        {/* ✅ Edit/Create mode অনুযায়ী title বদলায় */}
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          {isEditMode ? "Edit Your Review" : "Leave a Review"}
        </h1>
        {booking && (
          <p className="mt-1 text-sm text-muted-foreground">
            Session with{" "}
            <span className="font-medium text-foreground">{booking.tutor.name}</span>
          </p>
        )}
      </div>

      {success ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Star className="h-7 w-7 fill-green-500 text-green-500" />
            </div>
            <p className="text-lg font-semibold text-green-600">
              {isEditMode ? "Review Updated!" : "Review Submitted!"}
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to bookings...</p>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Rating <span className="text-destructive">*</span>
                </Label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-medium">
                  Comment{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="resize-none"
                  maxLength={500}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {comment.length} / 500
                </p>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/student/bookings")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={submitting || rating === 0}
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Submitting..."}</>
                  ) : (
                    <><Send className="h-4 w-4" />
                    {isEditMode ? "Update Review" : "Submit Review"}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
































// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import type { ApiResponse, MyBooking, CreateReviewPayload } from "@/types/student";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Star, Send, Loader2 } from "lucide-react";

// // ================= STAR RATING =================
// const StarRating = ({
//   value,
//   onChange,
// }: {
//   value: number;
//   onChange: (v: number) => void;
// }) => {
//   const [hovered, setHovered] = useState(0);
//   const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

//   return (
//     <div className="space-y-2">
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => onChange(star)}
//             onMouseEnter={() => setHovered(star)}
//             onMouseLeave={() => setHovered(0)}
//             aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
//             className="transition-transform hover:scale-110"
//           >
//             <Star
//               className={`h-8 w-8 transition-colors ${
//                 star <= (hovered || value)
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "text-muted-foreground/30"
//               }`}
//             />
//           </button>
//         ))}
//       </div>
//       {(hovered || value) > 0 && (
//         <p className="text-sm font-medium text-primary">
//           {labels[hovered || value]}
//         </p>
//       )}
//     </div>
//   );
// };

// // ================= PAGE =================
// export default function LeaveReviewPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const bookingId = searchParams.get("bookingId");

//   const [booking, setBooking] = useState<MyBooking | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   useEffect(() => {
//     if (!bookingId) {
//       setError("No booking ID provided");
//       setLoading(false);
//       return;
//     }

//     apiFetch<ApiResponse<MyBooking>>(`/api/bookings/${bookingId}`)
//       .then((res) => setBooking(res.data))
//       .catch(() => setError("Failed to load booking"))
//       .finally(() => setLoading(false));
//   }, [bookingId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (rating === 0) { setError("Please select a rating"); return; }
//     if (!booking) return;

//     setSubmitting(true);
//     setError(null);

//     const payload: CreateReviewPayload = {
//       bookingId: booking.id,
//       tutorId: booking.tutor.id,
//       rating,
//       comment,
//     };

//     try {
//       await apiFetch("/api/reviews", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });
//       setSuccess(true);
//       setTimeout(() => router.push("/student/bookings"), 1500);
//     } catch {
//       setError("Failed to submit review. You may have already reviewed this session.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error && !booking) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="space-y-3 text-center">
//           <p className="font-medium text-destructive">{error}</p>
//           <Button variant="outline" onClick={() => router.push("/student/bookings")}>
//             Back to Bookings
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-lg px-4 py-10">
//       {/* Header */}
//       <div className="mb-8">
//         <p className="text-xs font-semibold uppercase tracking-widest text-primary">
//           Session Feedback
//         </p>
//         <h1 className="mt-1 text-3xl font-black tracking-tight">Leave a Review</h1>
//         {booking && (
//           <p className="mt-1 text-sm text-muted-foreground">
//             Session with{" "}
//             <span className="font-medium text-foreground">{booking.tutor.name}</span>
//           </p>
//         )}
//       </div>

//       {/* Success */}
//       {success ? (
//         <Card>
//           <CardContent className="flex flex-col items-center gap-3 py-10">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
//               <Star className="h-7 w-7 fill-green-500 text-green-500" />
//             </div>
//             <p className="text-lg font-semibold text-green-600">Review Submitted!</p>
//             <p className="text-sm text-muted-foreground">Redirecting to bookings...</p>
//             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Your Feedback</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Rating */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">
//                   Rating <span className="text-destructive">*</span>
//                 </Label>
//                 <StarRating value={rating} onChange={setRating} />
//                 {rating === 0 && (
//                   <p className="text-xs text-muted-foreground">Click a star to rate</p>
//                 )}
//               </div>

//               {/* Comment */}
//               <div className="space-y-2">
//                 <Label htmlFor="comment" className="text-sm font-medium">
//                   Comment{" "}
//                   <span className="font-normal text-muted-foreground">(optional)</span>
//                 </Label>
//                 <Textarea
//                   id="comment"
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   placeholder="Share your experience — teaching style, helpfulness..."
//                   rows={4}
//                   className="resize-none"
//                   maxLength={500}
//                 />
//                 <p className="text-right text-xs text-muted-foreground">
//                   {comment.length} / 500
//                 </p>
//               </div>

//               {/* Error */}
//               {error && (
//                 <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                   {error}
//                 </p>
//               )}

//               {/* Buttons */}
//               <div className="flex gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => router.push("/student/bookings")}
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="flex-1 gap-2"
//                   disabled={submitting || rating === 0}
//                 >
//                   {submitting ? (
//                     <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
//                   ) : (
//                     <><Send className="h-4 w-4" />Submit Review</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }



































// // "use client";

// // import { useEffect, useState } from "react";
// // import { useSearchParams, useRouter } from "next/navigation";
// // import { apiFetch } from "@/lib/api";
// // import type { ApiResponse, MyBooking, CreateReviewPayload } from "@/types/student";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Label } from "@/components/ui/label";

// // // ================= STAR RATING =================
// // const StarRating = ({
// //   value,
// //   onChange,
// // }: {
// //   value: number;
// //   onChange: (v: number) => void;
// // }) => {
// //   return (
// //     <div className="flex gap-1">
// //       {[1, 2, 3, 4, 5].map((star) => (
// //         <button
// //           key={star}
// //           type="button"
// //           onClick={() => onChange(star)}
// //           className={`text-2xl transition-colors ${
// //             star <= value ? "text-yellow-400" : "text-muted-foreground"
// //           }`}
// //         >
// //           ★
// //         </button>
// //       ))}
// //     </div>
// //   );
// // };

// // // ================= COMPONENT =================
// // export default function LeaveReviewPage() {
// //   const searchParams = useSearchParams();
// //   const router = useRouter();
// //   const bookingId = searchParams.get("bookingId");

// //   const [booking, setBooking] = useState<MyBooking | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState(false);

// //   const [rating, setRating] = useState(0);
// //   const [comment, setComment] = useState("");

// //   // ✅ Fetch the booking details to know tutorId
// //   useEffect(() => {
// //     if (!bookingId) {
// //       setError("No booking ID provided");
// //       setLoading(false);
// //       return;
// //     }

// //     apiFetch<ApiResponse<MyBooking>>(`/api/bookings/${bookingId}`)
// //       .then((res) => setBooking(res.data))
// //       .catch(() => setError("Failed to load booking"))
// //       .finally(() => setLoading(false));
// //   }, [bookingId]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (rating === 0) {
// //       setError("Please select a rating");
// //       return;
// //     }

// //     if (!booking) return;

// //     setSubmitting(true);
// //     setError(null);

// //     const payload: CreateReviewPayload = {
// //       bookingId: booking.id,
// //       // NOTE: The backend will resolve tutorId from bookingId
// //       // So we pass an empty string here
// //       tutorId: booking.tutor.id,
// //       rating,
// //       comment,
// //     };

// //     try {
// //       await apiFetch("/api/reviews", {
// //         method: "POST",
// //         body: JSON.stringify(payload),
// //       });
// //       setSuccess(true);
// //       setTimeout(() => router.push("/student/bookings"), 1500);
// //     } catch {
// //       setError("Failed to submit review. You may have already reviewed this session.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
// //   if (error && !booking) return <p className="p-6 text-destructive">{error}</p>;

// //   return (
// //     <div className="container mx-auto px-4 py-10 max-w-lg">
// //       <h1 className="text-2xl font-bold mb-2">Leave a Review</h1>

// //       {booking && (
// //         <p className="text-muted-foreground mb-6">
// //           Session with <span className="font-medium text-foreground">{booking.tutor.name}</span>
// //         </p>
// //       )}

// //       {success ? (
// //         <p className="text-green-600 font-medium">
// //           ✅ Review submitted! Redirecting...
// //         </p>
// //       ) : (
// //         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
// //           {/* Rating */}
// //           <div>
// //             <Label>Rating</Label>
// //             <StarRating value={rating} onChange={setRating} />
// //           </div>

// //           {/* Comment */}
// //           <div>
// //             <Label htmlFor="comment">Comment (optional)</Label>
// //             <Textarea
// //               id="comment"
// //               value={comment}
// //               onChange={(e) => setComment(e.target.value)}
// //               placeholder="Share your experience..."
// //               rows={4}
// //             />
// //           </div>

// //           {error && <p className="text-sm text-destructive">{error}</p>}

// //           <Button type="submit" disabled={submitting}>
// //             {submitting ? "Submitting..." : "Submit Review"}
// //           </Button>
// //         </form>
// //       )}
// //     </div>
// //   );
// // }