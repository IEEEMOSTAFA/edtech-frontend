"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse } from "@/types/student";
import type { Tutor } from "@/types/tutor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ================= TYPES =================
type CreateBookingPayload = {
  tutorId: string;
  sessionDate: string;
  duration: number;
  notes?: string;
};

// ================= DURATION OPTIONS =================
const durationOptions = [
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

// ================= COMPONENT =================
export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorId = searchParams.get("tutorId");

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [sessionDate, setSessionDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");

  // ✅ Fetch tutor info to show name + hourlyRate
  useEffect(() => {
    if (!tutorId) {
      setError("No tutor selected");
      setLoading(false);
      return;
    }

    apiFetch<ApiResponse<Tutor>>(`/api/tutors/${tutorId}`)
      .then((res) => setTutor(res.data))
      .catch(() => setError("Failed to load tutor info"))
      .finally(() => setLoading(false));
  }, [tutorId]);

  // 💰 Calculate price
  const calculatedPrice = tutor
    ? ((tutor.hourlyRate * duration) / 60).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionDate) {
      setError("Please select a session date");
      return;
    }

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
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/bookings"), 1500);
    } catch {
      setError("Failed to create booking. The tutor may not be available on this day.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (error && !tutor) return <p className="p-6 text-destructive">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Book a Session</h1>

      {/* Tutor Info */}
      {tutor && (
        <div className="rounded-xl border p-4 mb-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Tutor</p>
          <p className="font-semibold text-lg">{tutor.user.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Rate: ${tutor.hourlyRate}/hr
          </p>
        </div>
      )}

      {success ? (
        <p className="text-green-600 font-medium">
          ✅ Booking confirmed! Redirecting...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Session Date */}
          <div>
            <Label htmlFor="sessionDate">Session Date & Time</Label>
            <Input
              id="sessionDate"
              type="datetime-local"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Duration */}
          <div>
            <Label>Duration</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    duration === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Preview */}
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-sm text-muted-foreground">Estimated Price</p>
            <p className="text-2xl font-bold">${calculatedPrice}</p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Topics you want to cover..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      )}
    </div>
  );
}