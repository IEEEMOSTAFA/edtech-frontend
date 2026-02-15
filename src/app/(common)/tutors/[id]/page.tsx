import { apiFetch } from "@/lib/api";
import type { Tutor, AvailabilitySlot, ApiResponse } from "@/types/tutor";

export default async function TutorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ FIX 1: unwrap params
  const { id } = await params;

  // Fetch tutor
  const tutorRes = await apiFetch<ApiResponse<Tutor>>(
    `/api/tutors/${id}`
  );

  // Guard: tutor not found
  if (!tutorRes?.data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Tutor not found</h1>
        <p>This tutor does not exist or has been removed.</p>
      </div>
    );
  }

  // Fetch availability
  const availabilityRes = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
    `/api/tutors/${id}/availability`
  );

  const availability = availabilityRes?.data ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        {tutorRes.data.user.name}
      </h1>

      <p className="mt-2">{tutorRes.data.bio}</p>

      <h2 className="mt-6 text-xl font-semibold">Availability</h2>

      {availability.length === 0 ? (
        <p className="text-gray-500">No availability slots.</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {availability.map((slot) => (
            <li key={slot.id}>
              Day {slot.dayOfWeek}: {slot.startTime} – {slot.endTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
















// import { apiFetch } from "@/lib/api";
// import type { Tutor, AvailabilitySlot } from "@/types/tutor";
// import type { ApiResponse } from "@/types/tutor";

// export default async function TutorProfile({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const tutor = await apiFetch<ApiResponse<Tutor>>(
//     `/api/tutors/${params.id}`
//   );

//   const availability = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
//     `/api/tutors/${params.id}/availability`
//   );

//   return (
//     <div>
//       <h1>{tutor.data.user.name}</h1>
//       <p>{tutor.data.bio}</p>

//       <h2>Availability</h2>
//       <ul>
//         {availability.data.map((slot) => (
//           <li key={slot.id}>
//             Day {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
