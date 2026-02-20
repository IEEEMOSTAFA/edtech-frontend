import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { StudentProfile } from "@/types/student";

export function ProfileInfoCard({ profile }: { profile: StudentProfile }) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.image ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold truncate">{profile.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {profile.email}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{profile.role}</Badge>
            <span className="text-xs text-muted-foreground">
              Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}