"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StudentProfile, UpdateProfilePayload } from "@/types/student";

interface Props {
  profile: StudentProfile;
  saving: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (payload: UpdateProfilePayload) => void;
}

export function ProfileForm({
  profile,
  saving,
  error,
  success,
  onSubmit,
}: Props) {
  const [name, setName] = useState(profile.name);
  const [image, setImage] = useState(profile.image ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: UpdateProfilePayload = {};
    if (name !== profile.name) payload.name = name;
    if (image !== profile.image) payload.image = image;

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Display name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label>Profile image URL</Label>
        <Input value={image} onChange={(e) => setImage(e.target.value)} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Profile updated successfully</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={saving} className="w-full h-11">
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}