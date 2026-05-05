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








