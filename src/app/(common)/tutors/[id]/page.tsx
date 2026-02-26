

import { apiFetch } from "@/lib/api";
import type { Tutor, AvailabilitySlot, ApiResponse } from "@/types/tutor";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  Star,
  Award,
  Calendar,
  MessageSquare,
  CheckCircle,
  User,
} from "lucide-react";

// ─── Review type ──────────────────────────────────────────────────────────────
interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    image?: string;
  };
}

// ─── Star Display (static) ────────────────────────────────────────────────────
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  // ✅ student undefined/null হলে render করবো না
  if (!review?.student) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {review.student?.image ? (
            <img
              src={review.student.image}
              alt={review.student?.name ?? "Student"}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-gray-900">
              {review.student?.name ?? "Anonymous"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="mt-1">
            <StarDisplay rating={review.rating} />
          </div>
          {review.comment && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ Fetch tutor — backend এ reviews include করা আছে getTutorById তে
  const tutorRes = await apiFetch<ApiResponse<Tutor & { reviews?: Review[] }>>(
    `/tutors/${id}`
  );

  if (!tutorRes?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
          <p className="mt-2 text-gray-600">
            This tutor does not exist or has been removed.
          </p>
          <Link
            href="/tutors"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
          >
            Browse Other Tutors
          </Link>
        </div>
      </div>
    );
  }

  // Fetch availability
  const availabilityRes = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
    `/tutors/${id}/availability`
  );

  const tutor = tutorRes.data;
  const reviews: Review[] = tutor.reviews ?? [];
  const availability = availabilityRes?.data ?? [];

  const daysOfWeek = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday",
  ];

  const groupedAvailability = availability.reduce(
    (acc, slot) => {
      const day = daysOfWeek[slot.dayOfWeek];
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot);
      return acc;
    },
    {} as Record<string, AvailabilitySlot[]>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Profile Card ── */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">

              {/* Avatar */}
              <div className="relative">
                {tutor.user.image ? (
                  <img
                    src={tutor.user.image}
                    alt={tutor.user.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {tutor.isFeatured && (
                  <div className="absolute -right-2 -top-2 rounded-full bg-yellow-400 p-2 shadow-lg">
                    <Award className="h-5 w-5 text-yellow-900" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  {tutor.user.name}
                </h1>
                <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                    <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                    <span className="font-semibold text-white">
                      {tutor.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-white/90">
                    {tutor.totalReviews}{" "}
                    {tutor.totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {/* Categories */}
                {tutor.categories && tutor.categories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {tutor.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm"
                      >
                        {cat.icon && <span className="mr-1">{cat.icon}</span>}
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-4 md:ml-auto">
                <div className="rounded-xl bg-white/20 px-6 py-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">${tutor.hourlyRate}</div>
                  <div className="text-sm text-white/80">per hour</div>
                </div>
                <div className="rounded-xl bg-white/20 px-6 py-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{tutor.experience}</div>
                  <div className="text-sm text-white/80">years exp.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="grid gap-8 md:grid-cols-3">

              {/* Left */}
              <div className="space-y-8 md:col-span-2">

                {/* About */}
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    About Me
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {tutor.bio || "No bio available."}
                  </p>
                </div>

                {/* Availability */}
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Weekly Availability
                  </h2>
                  {availability.length === 0 ? (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                      <Clock className="mx-auto mb-2 h-12 w-12 text-yellow-600" />
                      <p className="font-medium text-yellow-800">
                        No availability slots set yet
                      </p>
                      <p className="mt-1 text-sm text-yellow-600">
                        Check back later
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {daysOfWeek.map((day) => {
                        const slots = groupedAvailability[day];
                        if (!slots?.length) return null;
                        return (
                          <div
                            key={day}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                {day}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot) => (
                                  <div
                                    key={slot.id}
                                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
                                  >
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-700">
                                      {slot.startTime} – {slot.endTime}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right — Booking Card */}
              <div>
                <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                  <h3 className="mb-6 text-xl font-bold">Ready to Learn?</h3>
                  <div className="mb-6 rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Hourly Rate</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        <span className="text-2xl font-bold">{tutor.hourlyRate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 space-y-3">
                    {["Instant booking confirmation","Flexible scheduling","Secure payment"].map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/booking?tutorId=${id}`}
                    className="block w-full rounded-xl bg-white py-4 text-center font-bold text-blue-700 shadow-lg transition-all hover:scale-105 hover:bg-gray-100"
                  >
                    Book Session Now
                  </Link>
                  <p className="mt-4 text-center text-xs text-white/70">
                    Select your preferred time slot on the next page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Real Reviews Section */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Star className="h-6 w-6 text-yellow-500" />
            Student Reviews
            {reviews.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-700">
                {reviews.length}
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-200" />
              <p className="text-lg font-medium">No reviews yet</p>
              <p className="mt-1 text-sm text-gray-400">
                Be the first to book a session and leave a review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

























