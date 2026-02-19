"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, MyBooking, BookingStatus } from "@/types/student";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ================= HELPERS =================
const statusColor: Record<BookingStatus, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ================= COMPONENT =================
export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiResponse<MyBooking[]>>("/api/dashboard/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (error) return <p className="p-6 text-destructive">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* Left: Info */}
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base">
                  Tutor: {booking.tutor.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(booking.sessionDate)} · {booking.duration} min
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: ${booking.price.toFixed(2)}
                </p>
                {booking.notes && (
                  <p className="text-sm text-muted-foreground">
                    Notes: {booking.notes}
                  </p>
                )}
              </div>

              {/* Right: Status + Actions */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[booking.status]}`}
                >
                  {booking.status}
                </span>

                {/* Leave Review if COMPLETED */}
                {booking.status === "COMPLETED" && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/review?bookingId=${booking.id}`}>
                      Leave Review
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}