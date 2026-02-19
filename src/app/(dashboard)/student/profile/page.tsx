"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, StudentProfile, UpdateProfilePayload } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ================= COMPONENT =================
export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    apiFetch<ApiResponse<StudentProfile>>("/api/dashboard/profile")
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
        setImage(res.data.image ?? "");
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const payload: UpdateProfilePayload = {};
    if (name) payload.name = name;
    if (image) payload.image = image;

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
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (!profile) return <p className="p-6 text-destructive">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Read-only info */}
      <div className="rounded-xl border p-5 mb-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{profile.email}</p>
        <p className="text-sm text-muted-foreground mt-3">Role</p>
        <p className="font-medium">{profile.role}</p>
        <p className="text-sm text-muted-foreground mt-3">Joined</p>
        <p className="font-medium">
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <Label htmlFor="image">Profile Image URL</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="text-sm text-green-600">Profile updated successfully!</p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}