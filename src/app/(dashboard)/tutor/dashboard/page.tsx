"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { TutorDashboard, BookingStatus, ApiResponse } from "@/types/tutor";
import { Button } from "@/components/ui/button";
import { Clock, Settings, BookOpen, CalendarDays, Star, DollarSign, Loader2 } from "lucide-react";
import { StatCard } from "@/components/modules/tutor/Startcard";
import { SessionsPanel } from "@/components/modules/tutor/Sessionspanel";
import { ProfileCard } from "@/components/modules/tutor/Profilecard";
import { ReviewsCard } from "@/components/modules/tutor/Reviewscard";


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TutorDashboardPage() {
  const [data, setData] = useState<TutorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ApiResponse<TutorDashboard>>("/tutors/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ✅ Mark Complete হলে page reload ছাড়াই UI instantly update
  const handleComplete = (bookingId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingsAsTutor: prev.bookingsAsTutor.map((b) =>
          b.id === bookingId
            ? { ...b, status: "COMPLETED" as BookingStatus }
            : b
        ),
      };
    });
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm tracking-wide">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Failed to load dashboard.
      </div>
    );
  }

  // ── Derived data ──
  const bookings          = data.bookingsAsTutor;
  const reviews           = data.tutorProfile?.reviews ?? [];
  const profile           = data.tutorProfile ?? null;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const upcomingCount     = bookings.filter(
    (b) => new Date(b.sessionDate) >= new Date() && b.status === "CONFIRMED"
  ).length;
  const totalEarnings     = completedBookings.reduce((sum, b) => sum + (b.price ?? 0), 0);
  const avgRating         =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Tutor Dashboard
            </p>
            <h1 className="mt-1.5 text-3xl font-black tracking-tight">
              Welcome back,{" "}
              <span className="text-primary">{data.name.split(" ")[0]}</span> 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here is whats happening with your sessions today.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/tutor/availability">
                <Clock className="mr-1.5 h-4 w-4" />
                Availability
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/tutor/profile">
                <Settings className="mr-1.5 h-4 w-4" />
                Edit Profile
              </a>
            </Button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Sessions"
            value={bookings.length}
            icon={BookOpen}
            iconClass="bg-primary"
            sub="all time"
          />
          <StatCard
            label="Upcoming"
            value={upcomingCount}
            icon={CalendarDays}
            iconClass="bg-emerald-500"
            sub="confirmed sessions"
          />
          <StatCard
            label="Avg Rating"
            value={avgRating}
            icon={Star}
            iconClass="bg-amber-500"
            sub={`from ${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
          />
          <StatCard
            label="Total Earned"
            value={`$${totalEarnings.toFixed(0)}`}
            icon={DollarSign}
            iconClass="bg-sky-500"
            sub={`${completedBookings.length} completed`}
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Sessions Panel — 2/3 width */}
          <div className="lg:col-span-2">
            <SessionsPanel bookings={bookings} onComplete={handleComplete} />
          </div>

          {/* Right Column — 1/3 width */}
          <div className="flex flex-col gap-5">
            <ProfileCard
              name={data.name}
              email={data.email}
              profile={profile}
              avgRating={avgRating}
              reviewCount={reviews.length}
            />
            <ReviewsCard reviews={reviews} />
          </div>

        </div>
      </div>
    </div>
  );
}




























































