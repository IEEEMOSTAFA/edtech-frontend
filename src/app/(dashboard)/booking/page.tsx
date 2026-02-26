"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse } from "@/types/student";
import type { Tutor } from "@/types/tutor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, NotebookPen, Loader2 } from "lucide-react";
import { BookingPageSkeleton } from "@/components/modules/student/BookingPageSkeleton";
import { TutorSummaryCard } from "@/components/modules/student/TutorSummary";
import { SuccessState } from "@/components/modules/student/SuccessState";
import { DurationSelector } from "@/components/modules/student/DurationSelector";
import { PricePreview } from "@/components/modules/student/PricePreview";


type CreateBookingPayload = {
  tutorId: string;
  sessionDate: string;
  duration: number;
  notes?: string;
};

// = MAIN PAGE ==
export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorId = searchParams.get("tutorId");

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [sessionDate, setSessionDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!tutorId) {
      setError("No tutor selected");
      setLoading(false);
      return;
    }
    apiFetch<ApiResponse<Tutor>>(`/tutors/${tutorId}`)
      .then((res) => setTutor(res.data))
      .catch(() => setError("Failed to load tutor info"))
      .finally(() => setLoading(false));
  }, [tutorId]);

  const calculatedPrice = tutor
    ? ((tutor.hourlyRate * duration) / 60).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate) { setError("Please select a session date and time."); return; }
    if (!tutorId) return;

    setSubmitting(true);
    setError(null);

    const payload: CreateBookingPayload = {
      tutorId,
      sessionDate,
      duration,
      notes: notes || undefined,
    };

    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setTimeout(() => router.push("/student/bookings"), 1800);
    } catch {
      setError("Failed to create booking. The tutor may not be available at this time.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return <BookingPageSkeleton />;

  // ── Fatal error (no tutor loaded) ─────────────────────────────────────────
  if (error && !tutor) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-lg">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Book a Session</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to confirm your booking.
        </p>
      </div>

      {/* Tutor Card */}
      {tutor && <TutorSummaryCard tutor={tutor} />}

      {/* Success or Form */}
      {success ? (
        <SuccessState />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Session Date & Time */}
          <div className="space-y-1.5">
            <Label htmlFor="sessionDate" className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
              Session Date &amp; Time
            </Label>
            <input
              id="sessionDate"
              type="datetime-local"
              value={sessionDate}
              onChange={(e) => {
                setSessionDate(e.target.value);
                if (error) setError(null);
              }}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-shadow"
            />
          </div>

          {/* Duration — smart extracted component */}
          <DurationSelector value={duration} onChange={setDuration} />

          {/* Price Preview — smart extracted component */}
          {tutor && (
            <PricePreview
              price={calculatedPrice}
              duration={duration}
              hourlyRate={tutor.hourlyRate}
            />
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="flex items-center gap-1.5">
              <NotebookPen className="w-3.5 h-3.5 text-muted-foreground" />
              Notes
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Topics you want to cover, goals for this session..."
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Inline Error */}
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 rounded-xl text-base font-semibold"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

































// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import type { ApiResponse } from "@/types/student";
// import type { Tutor } from "@/types/tutor";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Clock,
//   DollarSign,
//   CalendarDays,
//   NotebookPen,
//   CheckCircle2,
//   Loader2,
//   BookOpen,
// } from "lucide-react";

// // ================= TYPES =================
// type CreateBookingPayload = {
//   tutorId: string;
//   sessionDate: string;
//   duration: number;
//   notes?: string;
// };

// // ================= DURATION OPTIONS =================
// const durationOptions = [
//   { label: "30 min", value: 30 },
//   { label: "1 hr", value: 60 },
//   { label: "1.5 hr", value: 90 },
//   { label: "2 hr", value: 120 },
// ];

// // ================= TUTOR SUMMARY CARD (UI only) =================
// function TutorSummaryCard({ tutor }: { tutor: Tutor }) {
//   const initials = tutor.user.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-5 flex items-center gap-4 mb-6">
//       {/* Avatar */}
//       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/10 flex items-center justify-center shrink-0">
//         <span className="text-lg font-bold text-primary">{initials}</span>
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <p className="font-semibold text-base truncate">{tutor.user.name}</p>
//         <p className="text-xs text-muted-foreground truncate mb-2">
//           {tutor.user.email}
//         </p>
//         <div className="flex items-center gap-3 flex-wrap">
//           <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
//             <DollarSign className="w-3 h-3" />
//             {tutor.hourlyRate}/hr
//           </span>
//           <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
//             <BookOpen className="w-3 h-3" />
//             {tutor.experience} yrs experience
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ================= PRICE PREVIEW (UI only) =================
// function PricePreview({ price }: { price: string }) {
//   return (
//     <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 px-5 py-4 flex items-center justify-between">
//       <div>
//         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
//           Estimated Total
//         </p>
//         <p className="text-3xl font-bold tracking-tight mt-0.5">${price}</p>
//       </div>
//       <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//         <DollarSign className="w-6 h-6 text-primary" />
//       </div>
//     </div>
//   );
// }

// // ================= SUCCESS STATE (UI only) =================
// function SuccessState() {
//   return (
//     <div className="flex flex-col items-center justify-center py-12 text-center">
//       <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 ring-1 ring-emerald-200 dark:ring-emerald-800">
//         <CheckCircle2 className="w-10 h-10 text-emerald-500" />
//       </div>
//       <p className="text-xl font-bold tracking-tight">Booking Confirmed!</p>
//       <p className="text-sm text-muted-foreground mt-1.5">
//         Redirecting to your bookings...
//       </p>
//     </div>
//   );
// }

// // ================= SKELETON (UI only) =================
// function BookingPageSkeleton() {
//   return (
//     <div className="container mx-auto px-4 py-10 max-w-lg animate-pulse">
//       <div className="h-7 w-40 bg-muted rounded-lg mb-2" />
//       <div className="h-4 w-56 bg-muted rounded mb-6" />
//       <div className="h-24 bg-muted rounded-2xl mb-6" />
//       <div className="space-y-4">
//         <div className="h-12 bg-muted rounded-xl" />
//         <div className="flex gap-2">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-10 flex-1 bg-muted rounded-xl" />
//           ))}
//         </div>
//         <div className="h-20 bg-muted rounded-xl" />
//         <div className="h-24 bg-muted rounded-xl" />
//         <div className="h-12 bg-muted rounded-xl" />
//       </div>
//     </div>
//   );
// }

// // ================= MAIN COMPONENT =================
// export default function BookingPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const tutorId = searchParams.get("tutorId");

//   const [tutor, setTutor] = useState<Tutor | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const [sessionDate, setSessionDate] = useState("");
//   const [duration, setDuration] = useState(60);
//   const [notes, setNotes] = useState("");

//   useEffect(() => {
//     if (!tutorId) {
//       setError("No tutor selected");
//       setLoading(false);
//       return;
//     }
//     apiFetch<ApiResponse<Tutor>>(`/api/tutors/${tutorId}`)
//       .then((res) => setTutor(res.data))
//       .catch(() => setError("Failed to load tutor info"))
//       .finally(() => setLoading(false));
//   }, [tutorId]);

//   // 💰 Price calculation — uses only hourlyRate which is in Tutor type
//   const calculatedPrice = tutor
//     ? ((tutor.hourlyRate * duration) / 60).toFixed(2)
//     : "0.00";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!sessionDate) { setError("Please select a session date"); return; }
//     if (!tutorId) return;

//     setSubmitting(true);
//     setError(null);

//     const payload: CreateBookingPayload = {
//       tutorId,
//       sessionDate,
//       duration,
//       notes: notes || undefined,
//     };

//     try {
//       await apiFetch("/api/bookings", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });
//       setSuccess(true);
//       setTimeout(() => router.push("/student/bookings"), 1800);
//     } catch {
//       setError("Failed to create booking. The tutor may not be available on this day.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <BookingPageSkeleton />;

//   if (error && !tutor) {
//     return (
//       <div className="container mx-auto px-4 py-10 max-w-lg">
//         <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4">
//           <p className="text-sm text-destructive">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-10 max-w-lg">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold tracking-tight">Book a Session</h1>
//         <p className="text-sm text-muted-foreground mt-1">
//           Fill in the details below to confirm your booking
//         </p>
//       </div>

//       {tutor && <TutorSummaryCard tutor={tutor} />}

//       {success ? (
//         <SuccessState />
//       ) : (
//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">

//           {/* Session Date */}
//           <div className="space-y-1.5">
//             <Label htmlFor="sessionDate" className="flex items-center gap-1.5">
//               <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
//               Session Date & Time
//             </Label>
//             <input
//               id="sessionDate"
//               type="datetime-local"
//               value={sessionDate}
//               onChange={(e) => setSessionDate(e.target.value)}
//               min={new Date().toISOString().slice(0, 16)}
//               className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-shadow"
//             />
//           </div>

//           {/* Duration */}
//           <div className="space-y-1.5">
//             <Label className="flex items-center gap-1.5">
//               <Clock className="w-3.5 h-3.5 text-muted-foreground" />
//               Duration
//             </Label>
//             <div className="grid grid-cols-4 gap-2">
//               {durationOptions.map((opt) => (
//                 <button
//                   key={opt.value}
//                   type="button"
//                   onClick={() => setDuration(opt.value)}
//                   className={`h-11 rounded-xl border text-sm font-medium transition-all duration-150 ${
//                     duration === opt.value
//                       ? "bg-primary text-primary-foreground border-primary shadow-sm"
//                       : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
//                   }`}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Price Preview */}
//           <PricePreview price={calculatedPrice} />

//           {/* Notes */}
//           <div className="space-y-1.5">
//             <Label htmlFor="notes" className="flex items-center gap-1.5">
//               <NotebookPen className="w-3.5 h-3.5 text-muted-foreground" />
//               Notes
//               <span className="text-muted-foreground font-normal">(optional)</span>
//             </Label>
//             <Textarea
//               id="notes"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Topics you want to cover, goals for this session..."
//               rows={3}
//               className="rounded-xl resize-none"
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
//               <p className="text-sm text-destructive">{error}</p>
//             </div>
//           )}

//           {/* Submit */}
//           <Button
//             type="submit"
//             disabled={submitting}
//             className="h-12 rounded-xl text-base font-semibold"
//           >
//             {submitting ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Confirming...
//               </span>
//             ) : (
//               "Confirm Booking"
//             )}
//           </Button>
//         </form>
//       )}
//     </div>
//   );
// }




