import { apiFetch } from "@/lib/api";

type Tutor = {
  userId: string;
  hourlyRate: number;
  experience: number;
  user: {
    name: string;
    email: string;
  };
};

export default async function TutorsPage() {
  const res = await apiFetch<{ data: Tutor[] }>("/api/tutors");

  return (
    <div className="grid grid-cols-3 gap-6">
      {res.data.map((tutor) => (
        <div key={tutor.userId} className="border p-4 rounded">
          <h3>{tutor.user.name}</h3>
          <p>Experience: {tutor.experience} years</p>
          <p>Rate: ${tutor.hourlyRate}/hr</p>

          <a href={`/tutors/${tutor.userId}`} className="text-blue-500">
            View Profile
          </a>
        </div>
      ))}
    </div>
  );
}
