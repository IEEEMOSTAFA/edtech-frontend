// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api";
// import type { TutorDashboard } from "@/types/tutor";
// import type { ApiResponse } from "@/types/tutor";

// export default function TutorDashboard() {
//   const [data, setData] = useState<ApiResponse<TutorDashboard> | null>(null);

//   useEffect(() => {
//     apiFetch<ApiResponse<TutorDashboard>>("/api/tutors/dashboard")
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Welcome Tutor</h1>
//       <p>Total Sessions: {data.data.bookingsAsTutor.length}</p>
//     </div>
//   );
// }

















"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type {
  TutorDashboard,
  DashboardBooking,
  DashboardReview,
  DashboardTutorProfile,
  BookingStatus,
  ApiResponse,
} from "@/types/tutor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  CalendarDays,
  Star,
  DollarSign,
  Clock,
  Settings,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isUpcoming(booking: DashboardBooking): boolean {
  return new Date(booking.sessionDate) >= new Date() && booking.status === "CONFIRMED";
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookingStatus,
  { variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }
> = {
  CONFIRMED: { variant: "default",     icon: <Clock       className="h-3 w-3" /> },
  COMPLETED: { variant: "secondary",   icon: <CheckCircle2 className="h-3 w-3" /> },
  CANCELLED: { variant: "destructive", icon: <XCircle     className="h-3 w-3" /> },
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

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            s <= rating
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  iconClass,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  iconClass: string;
}) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardContent className="pb-5 pt-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-black tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${iconClass}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── BookingRow ───────────────────────────────────────────────────────────────

function BookingRow({ booking }: { booking: DashboardBooking }) {
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
        {booking.totalPrice != null && (
          <p className="text-xs font-semibold text-muted-foreground">
            ${booking.totalPrice}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: DashboardReview }) {
  return (
    <div className="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {getInitials(review.student.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold">{review.student.name}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="line-clamp-2 pl-9 text-xs leading-relaxed text-muted-foreground">
         
          {review.comment}
         
        </p>
      )}
    </div>
  );
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

function ProfileCard({
  name,
  email,
  profile,
  avgRating,
  reviewCount,
}: {
  name: string;
  email: string;
  profile: DashboardTutorProfile | null;
  avgRating: string;
  reviewCount: number;
}) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/15 text-base font-black text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-bold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Profile stats */}
        {profile && (
          <>
            <Separator />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-bold text-emerald-500">
                  ${profile.hourlyRate}
                  <span className="text-xs font-normal text-muted-foreground">/hr</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold">{profile.experience} yrs</span>
              </div>
              {reviewCount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={Math.round(parseFloat(avgRating))} />
                    <span className="text-xs font-semibold">{avgRating}</span>
                  </div>
                </div>
              )}
              {profile.bio && (
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>
          </>
        )}

        <Button className="w-full" size="sm" asChild>
          <a href="/tutor/availability">
            <Clock className="mr-2 h-4 w-4" />
            Manage Availability
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TutorDashboardPage() {
  const [data, setData] = useState<TutorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ApiResponse<TutorDashboard>>("/api/tutors/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  // ── Derived data (all fully typed, zero `as any`) ──
  const bookings = data.bookingsAsTutor;
  const reviews  = data.tutorProfile?.reviews ?? [];
  const profile  = data.tutorProfile;

  const now      = new Date();
  const upcoming = bookings.filter(isUpcoming);
  const past     = bookings.filter((b) => !isUpcoming(b));

  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalEarnings     = completedBookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  const avgRating =
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
              Here's what's happening with your sessions today.
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
            value={upcoming.length}
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

          {/* ── Sessions Panel (2/3) ── */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="px-5 pb-0 pt-5">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-3">
                <Tabs defaultValue="upcoming">
                  <TabsList className="mx-3 mb-2 h-9">
                    <TabsTrigger value="upcoming" className="gap-1.5 text-xs">
                      Upcoming
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        {upcoming.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="past" className="gap-1.5 text-xs">
                      Past
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        {past.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-0">
                    {upcoming.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
                        <CalendarDays className="h-8 w-8 opacity-30" />
                        <p className="text-sm">No upcoming sessions</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {upcoming.slice(0, 8).map((b) => (
                          <BookingRow key={b.id} booking={b} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-0">
                    {past.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
                        <BookOpen className="h-8 w-8 opacity-30" />
                        <p className="text-sm">No past sessions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {past.slice(0, 8).map((b) => (
                          <BookingRow key={b.id} booking={b} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {(upcoming.length > 8 || past.length > 8) && (
                  <>
                    <Separator className="mt-2" />
                    <div className="px-4 py-2.5">
                      <Button variant="ghost" size="sm" className="text-xs text-primary" asChild>
                        <a href="/tutor/sessions">
                          View all sessions
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right Column (1/3) ── */}
          <div className="flex flex-col gap-5">
            <ProfileCard
              name={data.name}
              email={data.email}
              profile={profile}
              avgRating={avgRating}
              reviewCount={reviews.length}
            />

            {/* Reviews */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5">
                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                    <Star className="h-7 w-7 opacity-25" />
                    <p className="text-xs">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((r) => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                    {reviews.length > 3 && (
                      <p className="pt-1 text-center text-xs text-primary">
                        +{reviews.length - 3} more reviews
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}