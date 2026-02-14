"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function TutorDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/tutors/dashboard")
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
