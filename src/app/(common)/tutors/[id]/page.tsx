import { apiFetch } from "@/lib/api";
import type { Tutor, AvailabilitySlot } from "@/types/tutor";
import type { ApiResponse } from "@/types/tutor";

export default async function TutorProfile({
  params,
}: {
  params: { id: string };
}) {
  const tutor = await apiFetch<ApiResponse<Tutor>>(
    `/api/tutors/${params.id}`
  );

  const availability = await apiFetch<ApiResponse<AvailabilitySlot[]>>(
    `/api/tutors/${params.id}/availability`
  );

  return (
    <div>
      <h1>{tutor.data.user.name}</h1>
      <p>{tutor.data.bio}</p>

      <h2>Availability</h2>
      <ul>
        {availability.data.map((slot) => (
          <li key={slot.id}>
            Day {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
}
