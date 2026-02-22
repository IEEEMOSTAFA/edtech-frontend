"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardBooking, BookingStatus } from "@/types/tutor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDate, formatTime, getInitials } from "./Helpers";
// import { getInitials, formatDate, formatTime } from "./helpers";

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }
> = {
  CONFIRMED: {
    variant: "default",
    icon: <Clock className="h-3 w-3" />,
  },
  COMPLETED: {
    variant: "secondary",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  CANCELLED: {
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const { variant, icon } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} className="gap-1 text-xs">
      {icon}
      {status}
    </Badge>
  );
}

// ─── BookingRow ───────────────────────────────────────────────────────────────

type BookingRowProps = {
  booking: DashboardBooking;
  onComplete: (id: string) => void;
};

export function BookingRow({ booking, onComplete }: BookingRowProps) {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await apiFetch(`/api/bookings/${booking.id}/complete`, {
        method: "PATCH",
      });
      onComplete(booking.id); // ✅ parent state update → UI instantly changes
    } catch {
      alert("Failed to complete booking. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-muted/40">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
          {getInitials(booking.student.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{booking.student.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(booking.sessionDate)} · {formatTime(booking.sessionDate)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={booking.status} />

        {/* ✅ শুধু CONFIRMED booking এ Mark Complete button দেখাবে */}
        {booking.status === "CONFIRMED" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3 w-3" />
            )}
            {completing ? "Saving..." : "Mark Complete"}
          </Button>
        )}

        {booking.price != null && (
          <p className="text-xs font-semibold text-muted-foreground">
            ${Number(booking.price).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}