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
  User
} from "lucide-react";

export default async function TutorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch tutor
  const tutorRes = await apiFetch<ApiResponse<Tutor>>(
    `/api/tutors/${id}`
  );

  // Guard: tutor not found
  if (!tutorRes?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
          <p className="text-gray-600 mt-2">This tutor does not exist or has been removed.</p>
          <Link 
            href="/tutors"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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

  const availability = availabilityRes?.data ?? [];
  const tutor = tutorRes.data;

  // Group availability by day
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const groupedAvailability = availability.reduce((acc, slot) => {
    const day = daysOfWeek[slot.dayOfWeek];
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Profile Image */}
              <div className="relative">
                {tutor.user.image ? (
                  <img
                    src={tutor.user.image}
                    alt={tutor.user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {tutor.isFeatured && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {tutor.user.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span className="text-white font-semibold">
                      {tutor.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-white/90 text-sm">
                    {tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                {/* Categories */}
                {tutor.categories && tutor.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {tutor.categories.map((category) => (
                      <span
                        key={category.id}
                        className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="flex gap-4 md:ml-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <div className="text-2xl font-bold text-white">${tutor.hourlyRate}</div>
                  <div className="text-white/80 text-sm">per hour</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <div className="text-2xl font-bold text-white">{tutor.experience}</div>
                  <div className="text-white/80 text-sm">years exp.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Left Column - About & Availability */}
              <div className="md:col-span-2 space-y-8">
                
                {/* About Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {tutor.bio || "No bio available."}
                  </p>
                </div>

                {/* Availability Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Weekly Availability
                  </h2>

                  {availability.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                      <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                      <p className="text-yellow-800 font-medium">No availability slots set yet</p>
                      <p className="text-yellow-600 text-sm mt-1">Check back later for updates</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {daysOfWeek.map((day) => {
                        const slots = groupedAvailability[day];
                        if (!slots || slots.length === 0) return null;

                        return (
                          <div
                            key={day}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md text-sm">
                                  {day}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot) => (
                                  <div
                                    key={slot.id}
                                    className="flex items-center gap-1 bg-white px-3 py-1 rounded-md border border-gray-300 text-sm"
                                  >
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700 font-medium">
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

              {/* Right Column - Booking Card */}
              <div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl sticky top-6">
                  <h3 className="text-xl font-bold mb-6">Ready to Learn?</h3>
                  
                  {/* Price Info */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80">Hourly Rate</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-2xl font-bold">{tutor.hourlyRate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="text-sm">Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="text-sm">Flexible scheduling</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="text-sm">Secure payment</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/booking?tutorId=${id}`}
                    className="block w-full bg-white text-blue-700 text-center font-bold py-4 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Book Session Now
                  </Link>

                  <p className="text-white/70 text-xs text-center mt-4">
                    Select your preferred time slot on the next page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section (Placeholder) */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Student Reviews
          </h2>
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Reviews will be displayed here</p>
            <p className="text-sm">Implement review fetching in the next phase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
















































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

















