"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { TutorDashboard } from "@/types/tutor";
import type { ApiResponse } from "@/types/tutor";

export default function TutorDashboard() {
  const [data, setData] = useState<ApiResponse<TutorDashboard> | null>(null);

  useEffect(() => {
    apiFetch<ApiResponse<TutorDashboard>>("/api/tutors/dashboard")
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome Tutor</h1>
      <p>Total Sessions: {data.data.bookingsAsTutor.length}</p>
    </div>
  );
}
