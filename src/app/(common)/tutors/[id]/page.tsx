

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
    `/api/tutors/${id}`
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
    `/api/tutors/${id}/availability`
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








// import { TutorCard } from "@/components/modules/tutor/TutorCard";
// import { TutorEmptyState } from "@/components/modules/tutor/TutorEmptyState";
// import { TutorFiltersBar } from "@/components/modules/tutor/TutorFiltersBar";
// import { TutorHeroSection } from "@/components/modules/tutor/TutorHeroSection";
// import { TutorSectionHeading } from "@/components/modules/tutor/TutorSectionHeading";
// import { TutorStatsBar } from "@/components/modules/tutor/TutorStateBar";
// import { apiFetch } from "@/lib/api";
// import type { Tutor } from "@/types/tutor";


// export default async function TutorsPage() {
//   const res = await apiFetch<{ data: Tutor[] }>("/api/tutors");
//   const tutors = res?.data || [];

//   const featuredTutors = tutors.filter((t) => t.isFeatured);
//   const regularTutors = tutors.filter((t) => !t.isFeatured);
//   const isEmpty = tutors.length === 0;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* ── Hero + Search ─────────────── */}
//       <TutorHeroSection tutorCount={tutors.length} />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* ── Stats Bar ───────────────── */}
//         {!isEmpty && <TutorStatsBar tutors={tutors} />}

//         {/* ── Filters ────────── */}
//         <TutorFiltersBar />

//         {/* ── Featured Tutors ──────── */}
//         {featuredTutors.length > 0 && (
//           <section className="mb-12">
//             <TutorSectionHeading variant="featured" count={featuredTutors.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {featuredTutors.map((tutor) => (
//                 <TutorCard key={tutor.id} tutor={tutor} featured />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* ── All / Regular Tutors ─────────────────────────────────────── */}
//         <section>
//           {!isEmpty && (
//             <TutorSectionHeading
//               variant="all"
//               count={regularTutors.length}
//               hasFeatured={featuredTutors.length > 0}
//             />
//           )}

//           {isEmpty ? (
//             <TutorEmptyState />
//           ) : regularTutors.length === 0 && featuredTutors.length > 0 ? null : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {regularTutors.map((tutor) => (
//                 <TutorCard key={tutor.id} tutor={tutor} />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }


















// import { apiFetch } from "@/lib/api";
// import type { Tutor, AvailabilitySlot, ApiResponse } from "@/types/tutor";
// import Link from "next/link";
// import {
//   Clock,
//   DollarSign,
//   Star,
//   Award,
//   Calendar,
//   MessageSquare,
//   CheckCircle,
//   User,
// } from "lucide-react";

// // ─── Review type ──────────────────────────────────────────────────────────────
// interface Review {
//   id: string;
//   rating: number;
//   comment?: string;
//   createdAt: string;
//   student: {
//     id: string;
//     name: string;
//     image?: string;
//   };
// }

// // ─── Star Display (static) ────────────────────────────────────────────────────
// function StarDisplay({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`h-4 w-4 ${
//             star <= rating
//               ? "fill-yellow-400 text-yellow-400"
//               : "text-gray-200 fill-gray-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// // ─── Review Card ──────────────────────────────────────────────────────────────
// function ReviewCard({ review }: { review: Review }) {
//   return (
//     <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
//       <div className="flex items-start gap-4">
//         {/* Avatar */}
//         <div className="shrink-0">
//           {review.student.image ? (
//             <img
//               src={review.student.image}
//               alt={review.student.name}
//               className="h-10 w-10 rounded-full object-cover"
//             />
//           ) : (
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//               <User className="h-5 w-5 text-blue-600" />
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <p className="font-semibold text-gray-900">{review.student.name}</p>
//             <p className="text-xs text-gray-400">
//               {new Date(review.createdAt).toLocaleDateString("en-US", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//           <div className="mt-1">
//             <StarDisplay rating={review.rating} />
//           </div>
//           {review.comment && (
//             <p className="mt-2 text-sm leading-relaxed text-gray-600">
//               {review.comment}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default async function TutorProfilePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   // ✅ Fetch tutor — backend এ reviews include করা আছে getTutorById তে
//   const tutorRes = await apiFetch<ApiResponse<Tutor & { reviews?: Review[] }>>(
//     `/api/tutors/${id}`
//   );

//   if (!tutorRes?.data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
//           <p className="mt-2 text-gray-600">
//             This tutor does not exist or has been removed.
//           </p>
//           <Link
//             href="/tutors"
//             className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
//           >
//             Browse Other Tutors
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Fetch availability
//   const availabilityRes = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
//     `/api/tutors/${id}/availability`
//   );

//   const tutor = tutorRes.data;
//   const reviews: Review[] = tutor.reviews ?? [];
//   const availability = availabilityRes?.data ?? [];

//   const daysOfWeek = [
//     "Monday","Tuesday","Wednesday",
//     "Thursday","Friday","Saturday","Sunday",
//   ];

//   const groupedAvailability = availability.reduce(
//     (acc, slot) => {
//       const day = daysOfWeek[slot.dayOfWeek];
//       if (!acc[day]) acc[day] = [];
//       acc[day].push(slot);
//       return acc;
//     },
//     {} as Record<string, AvailabilitySlot[]>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

//         {/* ── Profile Card ── */}
//         <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12">
//             <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">

//               {/* Avatar */}
//               <div className="relative">
//                 {tutor.user.image ? (
//                   <img
//                     src={tutor.user.image}
//                     alt={tutor.user.name}
//                     className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
//                   />
//                 ) : (
//                   <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
//                     <User className="h-16 w-16 text-gray-400" />
//                   </div>
//                 )}
//                 {tutor.isFeatured && (
//                   <div className="absolute -right-2 -top-2 rounded-full bg-yellow-400 p-2 shadow-lg">
//                     <Award className="h-5 w-5 text-yellow-900" />
//                   </div>
//                 )}
//               </div>

//               {/* Info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
//                   {tutor.user.name}
//                 </h1>
//                 <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
//                   <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
//                     <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
//                     <span className="font-semibold text-white">
//                       {tutor.rating.toFixed(1)}
//                     </span>
//                   </div>
//                   <span className="text-sm text-white/90">
//                     {tutor.totalReviews}{" "}
//                     {tutor.totalReviews === 1 ? "review" : "reviews"}
//                   </span>
//                 </div>

//                 {/* Categories */}
//                 {tutor.categories && tutor.categories.length > 0 && (
//                   <div className="flex flex-wrap justify-center gap-2 md:justify-start">
//                     {tutor.categories.map((cat) => (
//                       <span
//                         key={cat.id}
//                         className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm"
//                       >
//                         {cat.icon && <span className="mr-1">{cat.icon}</span>}
//                         {cat.name}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Stats */}
//               <div className="flex gap-4 md:ml-auto">
//                 <div className="rounded-xl bg-white/20 px-6 py-4 text-center backdrop-blur-sm">
//                   <div className="text-2xl font-bold text-white">${tutor.hourlyRate}</div>
//                   <div className="text-sm text-white/80">per hour</div>
//                 </div>
//                 <div className="rounded-xl bg-white/20 px-6 py-4 text-center backdrop-blur-sm">
//                   <div className="text-2xl font-bold text-white">{tutor.experience}</div>
//                   <div className="text-sm text-white/80">years exp.</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="px-8 py-8">
//             <div className="grid gap-8 md:grid-cols-3">

//               {/* Left */}
//               <div className="space-y-8 md:col-span-2">

//                 {/* About */}
//                 <div>
//                   <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
//                     <MessageSquare className="h-6 w-6 text-blue-600" />
//                     About Me
//                   </h2>
//                   <p className="text-lg leading-relaxed text-gray-700">
//                     {tutor.bio || "No bio available."}
//                   </p>
//                 </div>

//                 {/* Availability */}
//                 <div>
//                   <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
//                     <Calendar className="h-6 w-6 text-blue-600" />
//                     Weekly Availability
//                   </h2>
//                   {availability.length === 0 ? (
//                     <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
//                       <Clock className="mx-auto mb-2 h-12 w-12 text-yellow-600" />
//                       <p className="font-medium text-yellow-800">
//                         No availability slots set yet
//                       </p>
//                       <p className="mt-1 text-sm text-yellow-600">
//                         Check back later
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="grid gap-3">
//                       {daysOfWeek.map((day) => {
//                         const slots = groupedAvailability[day];
//                         if (!slots?.length) return null;
//                         return (
//                           <div
//                             key={day}
//                             className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300"
//                           >
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                               <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
//                                 {day}
//                               </span>
//                               <div className="flex flex-wrap gap-2">
//                                 {slots.map((slot) => (
//                                   <div
//                                     key={slot.id}
//                                     className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
//                                   >
//                                     <Clock className="h-4 w-4 text-gray-500" />
//                                     <span className="font-medium text-gray-700">
//                                       {slot.startTime} – {slot.endTime}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right — Booking Card */}
//               <div>
//                 <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
//                   <h3 className="mb-6 text-xl font-bold">Ready to Learn?</h3>
//                   <div className="mb-6 rounded-lg bg-white/20 p-4 backdrop-blur-sm">
//                     <div className="flex items-center justify-between">
//                       <span className="text-white/80">Hourly Rate</span>
//                       <div className="flex items-center gap-1">
//                         <DollarSign className="h-5 w-5" />
//                         <span className="text-2xl font-bold">{tutor.hourlyRate}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mb-6 space-y-3">
//                     {["Instant booking confirmation","Flexible scheduling","Secure payment"].map((f) => (
//                       <div key={f} className="flex items-center gap-3">
//                         <CheckCircle className="h-5 w-5 text-green-300" />
//                         <span className="text-sm">{f}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <Link
//                     href={`/booking?tutorId=${id}`}
//                     className="block w-full rounded-xl bg-white py-4 text-center font-bold text-blue-700 shadow-lg transition-all hover:scale-105 hover:bg-gray-100"
//                   >
//                     Book Session Now
//                   </Link>
//                   <p className="mt-4 text-center text-xs text-white/70">
//                     Select your preferred time slot on the next page
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ✅ Real Reviews Section */}
//         <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
//           <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
//             <Star className="h-6 w-6 text-yellow-500" />
//             Student Reviews
//             {reviews.length > 0 && (
//               <span className="ml-2 rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-700">
//                 {reviews.length}
//               </span>
//             )}
//           </h2>

//           {reviews.length === 0 ? (
//             <div className="py-12 text-center text-gray-500">
//               <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-200" />
//               <p className="text-lg font-medium">No reviews yet</p>
//               <p className="mt-1 text-sm text-gray-400">
//                 Be the first to book a session and leave a review!
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {reviews.map((review) => (
//                 <ReviewCard key={review.id} review={review} />
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


























// import { apiFetch } from "@/lib/api";
// import type { Tutor, AvailabilitySlot, ApiResponse } from "@/types/tutor";
// import Link from "next/link";
// import { 
//   Clock, 
//   DollarSign, 
//   Star, 
//   Award, 
//   Calendar,
//   MessageSquare,
//   CheckCircle,
//   User
// } from "lucide-react";

// export default async function TutorProfile({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   // Fetch tutor
//   const tutorRes = await apiFetch<ApiResponse<Tutor>>(
//     `/api/tutors/${id}`
//   );

//   // Guard: tutor not found
//   if (!tutorRes?.data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
//           <p className="text-gray-600 mt-2">This tutor does not exist or has been removed.</p>
//           <Link 
//             href="/tutors"
//             className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Browse Other Tutors
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Fetch availability
//   const availabilityRes = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
//     `/api/tutors/${id}/availability`
//   );

//   const availability = availabilityRes?.data ?? [];
//   const tutor = tutorRes.data;

//   // Group availability by day
//   const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//   const groupedAvailability = availability.reduce((acc, slot) => {
//     const day = daysOfWeek[slot.dayOfWeek];
//     if (!acc[day]) acc[day] = [];
//     acc[day].push(slot);
//     return acc;
//   }, {} as Record<string, AvailabilitySlot[]>);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12">
//             <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
//               {/* Profile Image */}
//               <div className="relative">
//                 {tutor.user.image ? (
//                   <img
//                     src={tutor.user.image}
//                     alt={tutor.user.name}
//                     className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
//                   />
//                 ) : (
//                   <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center">
//                     <User className="w-16 h-16 text-gray-400" />
//                   </div>
//                 )}
//                 {tutor.isFeatured && (
//                   <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
//                     <Award className="w-5 h-5" />
//                   </div>
//                 )}
//               </div>

//               {/* Profile Info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
//                   {tutor.user.name}
//                 </h1>
                
//                 {/* Rating & Reviews */}
//                 <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
//                   <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                     <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
//                     <span className="text-white font-semibold">
//                       {tutor.rating.toFixed(1)}
//                     </span>
//                   </div>
//                   <div className="text-white/90 text-sm">
//                     {tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'}
//                   </div>
//                 </div>

//                 {/* Categories */}
//                 {tutor.categories && tutor.categories.length > 0 && (
//                   <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//                     {tutor.categories.map((category) => (
//                       <span
//                         key={category.id}
//                         className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
//                       >
//                         {category.name}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Stats Cards */}
//               <div className="flex gap-4 md:ml-auto">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
//                   <div className="text-2xl font-bold text-white">${tutor.hourlyRate}</div>
//                   <div className="text-white/80 text-sm">per hour</div>
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
//                   <div className="text-2xl font-bold text-white">{tutor.experience}</div>
//                   <div className="text-white/80 text-sm">years exp.</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="px-8 py-8">
//             <div className="grid md:grid-cols-3 gap-8">
              
//               {/* Left Column - About & Availability */}
//               <div className="md:col-span-2 space-y-8">
                
//                 {/* About Section */}
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <MessageSquare className="w-6 h-6 text-blue-600" />
//                     About Me
//                   </h2>
//                   <p className="text-gray-700 leading-relaxed text-lg">
//                     {tutor.bio || "No bio available."}
//                   </p>
//                 </div>

//                 {/* Availability Section */}
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <Calendar className="w-6 h-6 text-blue-600" />
//                     Weekly Availability
//                   </h2>

//                   {availability.length === 0 ? (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
//                       <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
//                       <p className="text-yellow-800 font-medium">No availability slots set yet</p>
//                       <p className="text-yellow-600 text-sm mt-1">Check back later for updates</p>
//                     </div>
//                   ) : (
//                     <div className="grid gap-3">
//                       {daysOfWeek.map((day) => {
//                         const slots = groupedAvailability[day];
//                         if (!slots || slots.length === 0) return null;

//                         return (
//                           <div
//                             key={day}
//                             className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition"
//                           >
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-3">
//                                 <div className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md text-sm">
//                                   {day}
//                                 </div>
//                               </div>
//                               <div className="flex flex-wrap gap-2">
//                                 {slots.map((slot) => (
//                                   <div
//                                     key={slot.id}
//                                     className="flex items-center gap-1 bg-white px-3 py-1 rounded-md border border-gray-300 text-sm"
//                                   >
//                                     <Clock className="w-4 h-4 text-gray-500" />
//                                     <span className="text-gray-700 font-medium">
//                                       {slot.startTime} – {slot.endTime}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Column - Booking Card */}
//               <div>
//                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl sticky top-6">
//                   <h3 className="text-xl font-bold mb-6">Ready to Learn?</h3>
                  
//                   {/* Price Info */}
//                   <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-white/80">Hourly Rate</span>
//                       <div className="flex items-center gap-1">
//                         <DollarSign className="w-5 h-5" />
//                         <span className="text-2xl font-bold">{tutor.hourlyRate}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Features */}
//                   <div className="space-y-3 mb-6">
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-green-300" />
//                       <span className="text-sm">Instant booking confirmation</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-green-300" />
//                       <span className="text-sm">Flexible scheduling</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-green-300" />
//                       <span className="text-sm">Secure payment</span>
//                     </div>
//                   </div>

//                   {/* Book Button */}
//                   <Link
//                     href={`/booking?tutorId=${id}`}
//                     className="block w-full bg-white text-blue-700 text-center font-bold py-4 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
//                   >
//                     Book Session Now
//                   </Link>

//                   <p className="text-white/70 text-xs text-center mt-4">
//                     Select your preferred time slot on the next page
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Reviews Section (Placeholder) */}
//         <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <Star className="w-6 h-6 text-yellow-500" />
//             Student Reviews
//           </h2>
//           <div className="text-center py-12 text-gray-500">
//             <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg">Reviews will be displayed here</p>
//             <p className="text-sm">Implement review fetching in the next phase</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















































// import { apiFetch } from "@/lib/api";
// import type { Tutor, AvailabilitySlot, ApiResponse } from "@/types/tutor";

// export default async function TutorProfile({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ FIX 1: unwrap params
//   const { id } = await params;

//   // Fetch tutor
//   const tutorRes = await apiFetch<ApiResponse<Tutor>>(
//     `/api/tutors/${id}`
//   );

//   // Guard: tutor not found
//   if (!tutorRes?.data) {
//     return (
//       <div className="p-6">
//         <h1 className="text-xl font-semibold">Tutor not found</h1>
//         <p>This tutor does not exist or has been removed.</p>
//       </div>
//     );
//   }

//   // Fetch availability
//   const availabilityRes = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
//     `/api/tutors/${id}/availability`
//   );

//   const availability = availabilityRes?.data ?? [];

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         {tutorRes.data.user.name}
//       </h1>

//       <p className="mt-2">{tutorRes.data.bio}</p>

//       <h2 className="mt-6 text-xl font-semibold">Availability</h2>

//       {availability.length === 0 ? (
//         <p className="text-gray-500">No availability slots.</p>
//       ) : (
//         <ul className="mt-2 space-y-1">
//           {availability.map((slot) => (
//             <li key={slot.id}>
//               Day {slot.dayOfWeek}: {slot.startTime} – {slot.endTime}
//             </li>
//           ))}
//         </ul>
//       )}


//         <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
//         Book Session
//       </button>
//     </div>
//   );
// }

















