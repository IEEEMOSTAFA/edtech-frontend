import { apiFetch } from "@/lib/api";
import Link from "next/link";

type Tutor = {
  id: string;        // TutorProfile.id
  userId: string;    // User.id (duplicate but ok)
  hourlyRate: number;
  experience: number;
  user: {
    id: string;      // ✅ MUST (this was missing)
    name: string;
    email: string;
  };
};

export default async function TutorsPage() {
  const res = await apiFetch<{ data: Tutor[] }>("/api/tutors");

  return (
    <div className="grid grid-cols-3 gap-6">
      {res.data.map((tutor) => (
        <div key={tutor.user.id} className="border p-4 rounded">
          <h3 className="text-lg font-semibold">
            {tutor.user.name}
          </h3>

          <p>Experience: {tutor.experience} years</p>
          <p>Rate: ${tutor.hourlyRate}/hr</p>

          <Link
            href={`/tutors/${tutor.userId}`} // ✅ User.id
            className="text-blue-500 underline"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );
}


























// import { apiFetch } from "@/lib/api";

// type Tutor = {
//   id: string;
//   userId: string;
//   hourlyRate: number;
//   experience: number;
//   user: {
//     name: string;
//     email: string;
//   };
// };

// export default async function TutorsPage() {
//   const res = await apiFetch<{ data: Tutor[] }>("/api/tutors");

//   return (
//     <div className="grid grid-cols-3 gap-6">
//       {res.data.map((tutor) => (
//         <div key={tutor.userId} className="border p-4 rounded">
//           <h3>{tutor.user.name}</h3>
//           <p>Experience: {tutor.experience} years</p>
//           <p>Rate: ${tutor.hourlyRate}/hr</p>

//           <a href={`/tutors/${tutor.user.id}`} className="text-blue-500">
//             View Profile
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// }
