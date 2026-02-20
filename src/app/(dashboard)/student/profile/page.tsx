"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  StudentProfile,
  UpdateProfilePayload,
} from "@/types/student";
import StudentProfileUI from "@/components/modules/student/ProfileCard";
// import StudentProfileUI from "@/components/modules/student/profile";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiFetch<ApiResponse<StudentProfile>>("/api/dashboard/profile")
      .then((res) => setProfile(res.data))
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(payload: UpdateProfilePayload) {
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await apiFetch<ApiResponse<StudentProfile>>(
        "/api/dashboard/profile",
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      setProfile(res.data);
      setSuccess(true);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudentProfileUI
      profile={profile}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
      onSubmit={handleUpdate}
    />
  );
}





































































