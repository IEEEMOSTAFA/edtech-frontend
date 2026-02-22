"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, FileText, Star } from "lucide-react";
import type { MyBooking, BookingStatus } from "@/types/student";

// ================= STATUS CONFIG =================
export const statusConfig: Record<
  BookingStatus,
  { label: string; badgeClass: string; dotClass: string; barClass: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    dotClass: "bg-blue-500",
    barClass: "bg-gradient-to-r from-blue-500 to-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass:
      "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    dotClass: "bg-red-400",
    barClass: "bg-gradient-to-r from-red-400 to-rose-400",
  },
};

// ================= FORMAT HELPERS =================
export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

// ================= AVATAR =================
function TutorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/10">
      <span className="text-sm font-bold text-primary">{initials}</span>
    </div>
  );
}

// ================= STAR DISPLAY =================
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

// ================= BOOKING CARD =================
type BookingCardProps = {
  booking: MyBooking;
};

export function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status];

  return (
    <div className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Top gradient bar */}
      <div className={`h-1 w-full ${status.barClass}`} />

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

          {/* Left: Tutor info */}
          <div className="flex gap-3 items-start flex-1 min-w-0">
            <TutorAvatar name={booking.tutor.name} />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight truncate">
                {booking.tutor.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mb-2">
                {booking.tutor.email}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
                  <Calendar className="w-3 h-3" />
                  {formatDate(booking.sessionDate)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
                  <Clock className="w-3 h-3" />
                  {formatTime(booking.sessionDate)} · {booking.duration} min
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
                  <DollarSign className="w-3 h-3" />
                  {booking.price.toFixed(2)}
                </span>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="flex items-start gap-1.5 mt-2">
                  <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground italic line-clamp-1">
                    {booking.notes}
                  </p>
                </div>
              )}

              {/* ✅ Review preview — review থাকলে দেখাবে */}
              {booking.review && (
                <div className="flex items-center gap-2 mt-2">
                  <StarDisplay rating={booking.review.rating} />
                  {booking.review.comment && (
                    <p className="text-xs text-muted-foreground italic line-clamp-1">
                      {booking.review.comment}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Status + Action */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
              {status.label}
            </span>

            {/* ✅ Review buttons — COMPLETED only */}
            {booking.status === "COMPLETED" && (
              <>
                {booking.review ? (
                  // Review আছে → Edit করার option
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400 transition-colors"
                  >
                    <Link href={`/student/review?reviewId=${booking.review.id}`}>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      Edit Review
                    </Link>
                  </Button>
                ) : (
                  // Review নেই → দেওয়ার option
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400 transition-colors"
                  >
                    <Link href={`/student/review?bookingId=${booking.id}`}>
                      <Star className="w-3 h-3" />
                      Give Review
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ================= SKELETON =================
export function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-muted" />
      <div className="p-5 flex gap-3">
        <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-36 bg-muted rounded-lg" />
          <div className="h-3 w-48 bg-muted rounded-lg" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 w-24 bg-muted rounded-lg" />
            <div className="h-6 w-20 bg-muted rounded-lg" />
            <div className="h-6 w-16 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= EMPTY STATE =================
export function BookingsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 ring-1 ring-primary/10">
        <Calendar className="w-9 h-9 text-primary/50" />
      </div>
      <p className="font-semibold text-lg tracking-tight">No bookings yet</p>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
        Find an expert tutor and book your first learning session today
      </p>
      <Button asChild className="mt-6 rounded-xl" size="sm">
        <Link href="/tutors">Browse Tutors</Link>
      </Button>
    </div>
  );
}












// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Calendar, Clock, DollarSign, FileText, Star } from "lucide-react";
// import type { MyBooking, BookingStatus } from "@/types/student";

// // ================= STATUS CONFIG =================
// export const statusConfig: Record<
//   BookingStatus,
//   { label: string; badgeClass: string; dotClass: string; barClass: string }
// > = {
//   CONFIRMED: {
//     label: "Confirmed",
//     badgeClass:
//       "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
//     dotClass: "bg-blue-500",
//     barClass: "bg-gradient-to-r from-blue-500 to-blue-400",
//   },
//   COMPLETED: {
//     label: "Completed",
//     badgeClass:
//       "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
//     dotClass: "bg-emerald-500",
//     barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     badgeClass:
//       "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
//     dotClass: "bg-red-400",
//     barClass: "bg-gradient-to-r from-red-400 to-rose-400",
//   },
// };

// // ================= FORMAT HELPERS =================
// export const formatDate = (dateStr: string) =>
//   new Date(dateStr).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

// export const formatTime = (dateStr: string) =>
//   new Date(dateStr).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// // ================= AVATAR =================
// function TutorAvatar({ name }: { name: string }) {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/10">
//       <span className="text-sm font-bold text-primary">{initials}</span>
//     </div>
//   );
// }

// // ================= BOOKING CARD =================
// type BookingCardProps = {
//   booking: MyBooking;
// };

// export function BookingCard({ booking }: BookingCardProps) {
//   const status = statusConfig[booking.status];

//   return (
//     <div className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
//       {/* Top gradient bar */}
//       <div className={`h-1 w-full ${status.barClass}`} />

//       <div className="p-5">
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

//           {/* Left: Tutor info */}
//           <div className="flex gap-3 items-start flex-1 min-w-0">
//             <TutorAvatar name={booking.tutor.name} />

//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-base leading-tight truncate">
//                 {booking.tutor.name}
//               </p>
//               <p className="text-xs text-muted-foreground truncate mb-2">
//                 {booking.tutor.email}
//               </p>

//               {/* Meta pills */}
//               <div className="flex flex-wrap gap-2">
//                 <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
//                   <Calendar className="w-3 h-3" />
//                   {formatDate(booking.sessionDate)}
//                 </span>
//                 <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
//                   <Clock className="w-3 h-3" />
//                   {formatTime(booking.sessionDate)} · {booking.duration} min
//                 </span>
//                 <span className="inline-flex items-center gap-1 text-xs bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
//                   <DollarSign className="w-3 h-3" />
//                   {booking.price.toFixed(2)}
//                 </span>
//               </div>

//               {/* Notes */}
//               {booking.notes && (
//                 <div className="flex items-start gap-1.5 mt-2">
//                   <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
//                   <p className="text-xs text-muted-foreground italic line-clamp-1">
//                     {booking.notes}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Status + Action */}
//           <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
//             {/* Status badge */}
//             <span
//               className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.badgeClass}`}
//             >
//               <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
//               {status.label}
//             </span>

//             {/* Give Review — COMPLETED only */}
//             {booking.status === "COMPLETED" && (
//               <Button
//                 asChild
//                 size="sm"
//                 variant="outline"
//                 className="h-8 text-xs gap-1.5 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400 transition-colors"
//               >
//                 <Link href={`/student/review?bookingId=${booking.id}`}>
//                   <Star className="w-3 h-3" />
//                   Give Review
//                 </Link>
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ================= SKELETON =================
// export function BookingCardSkeleton() {
//   return (
//     <div className="rounded-2xl border overflow-hidden animate-pulse">
//       <div className="h-1 w-full bg-muted" />
//       <div className="p-5 flex gap-3">
//         <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
//         <div className="flex-1 space-y-2.5">
//           <div className="h-4 w-36 bg-muted rounded-lg" />
//           <div className="h-3 w-48 bg-muted rounded-lg" />
//           <div className="flex gap-2 mt-1">
//             <div className="h-6 w-24 bg-muted rounded-lg" />
//             <div className="h-6 w-20 bg-muted rounded-lg" />
//             <div className="h-6 w-16 bg-muted rounded-lg" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ================= EMPTY STATE =================
// export function BookingsEmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 ring-1 ring-primary/10">
//         <Calendar className="w-9 h-9 text-primary/50" />
//       </div>
//       <p className="font-semibold text-lg tracking-tight">No bookings yet</p>
//       <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
//         Find an expert tutor and book your first learning session today
//       </p>
//       <Button asChild className="mt-6 rounded-xl" size="sm">
//         <Link href="/tutors">Browse Tutors</Link>
//       </Button>
//     </div>
//   );
// }