"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CalendarDays, ArrowRight } from "lucide-react";

export function SuccessState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / 18, 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Animated ring */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center ring-1 ring-emerald-200 dark:ring-emerald-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
      </div>

      <p className="text-2xl font-black tracking-tight mb-1">Booking Confirmed!</p>
      <p className="text-sm text-muted-foreground mb-1">
        Your session has been successfully scheduled.
      </p>

      {/* Redirect bar */}
      <div className="mt-6 w-full max-w-xs">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            Redirecting to your bookings
          </span>
          <span className="flex items-center gap-0.5">
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}