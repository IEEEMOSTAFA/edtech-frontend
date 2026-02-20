import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
// import { ProfileInfoCard } from "./profile-info-card";
// import { ProfileForm } from "./profile-form";
import type { StudentProfile } from "@/types/student";
import { ProfileForm } from "./profile-form";
import { ProfileInfoCard } from "./profile-info-card";

interface Props {
  profile: StudentProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (payload: any) => void;
}

export default function StudentProfileUI({
  profile,
  loading,
  saving,
  error,
  success,
  onSubmit,
}: Props) {
  if (loading) {
    return (
      <div className="container max-w-lg py-10 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-lg py-10 text-destructive">
        Profile not found
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-10 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </header>

      <ProfileInfoCard profile={profile} />

      <Separator />

      <ProfileForm
        profile={profile}
        saving={saving}
        error={error}
        success={success}
        onSubmit={onSubmit}
      />
    </div>
  );
}