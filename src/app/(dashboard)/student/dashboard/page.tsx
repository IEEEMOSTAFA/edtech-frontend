"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, StudentDashboard } from "@/types/student";
import StudentDashboardUI from "@/components/modules/student/dashboard";
// import StudentDashboardUI from "@/components/modules/student/dashboard";

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

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-6 text-destructive">{error}</p>;
  }

  if (!data) return null;

  return <StudentDashboardUI data={data} />;
}

















