import type { DashboardTutorProfile } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Star } from "lucide-react";
import { getInitials } from "./Helpers";
// import { getInitials } from "./helpers";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={
            s <= rating
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

type ProfileCardProps = {
  name: string;
  email: string;
  profile: DashboardTutorProfile | null;
  avgRating: string;
  reviewCount: number;
};

export function ProfileCard({
  name,
  email,
  profile,
  avgRating,
  reviewCount,
}: ProfileCardProps) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/15 text-base font-black text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-bold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {profile && (
          <>
            <Separator />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-bold text-emerald-500">
                  ${profile.hourlyRate}
                  <span className="text-xs font-normal text-muted-foreground">/hr</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold">{profile.experience} yrs</span>
              </div>
              {reviewCount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={Math.round(parseFloat(avgRating))} />
                    <span className="text-xs font-semibold">{avgRating}</span>
                  </div>
                </div>
              )}
              {profile.bio && (
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>
          </>
        )}

        <Button className="w-full" size="sm" asChild>
          <a href="/tutor/availability">
            <Clock className="mr-2 h-4 w-4" />
            Manage Availability
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}