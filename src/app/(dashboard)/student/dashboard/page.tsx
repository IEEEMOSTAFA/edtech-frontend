// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api";
// import type { TutorDashboard } from "@/types/tutor";
// import type { ApiResponse } from "@/types/tutor";

// export default function TutorDashboard() {
//   const [data, setData] = useState<ApiResponse<TutorDashboard> | null>(null);

//   useEffect(() => {
//     apiFetch<ApiResponse<TutorDashboard>>("/api/dashboard")
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
import type { ApiResponse, StudentDashboard } from "@/types/student";

// ================= COMPONENT =================
export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiResponse<StudentDashboard>>("/api/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (error) return <p className="p-6 text-destructive">{error}</p>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Bookings */}
        <div className="rounded-xl border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-4xl font-bold mt-2">{data.totalBookings}</p>
        </div>

        {/* Completed Bookings */}
        <div className="rounded-xl border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Completed Sessions</p>
          <p className="text-4xl font-bold mt-2">{data.completedBookings}</p>
        </div>
      </div>
    </div>
  );
}