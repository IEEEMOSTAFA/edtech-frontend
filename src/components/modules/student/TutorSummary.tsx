import { DollarSign, BookOpen, Star } from "lucide-react";
import type { Tutor } from "@/types/tutor";

interface TutorSummaryCardProps {
  tutor: Tutor;
}

export function TutorSummaryCard({ tutor }: TutorSummaryCardProps) {
  const initials = tutor.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden mb-6 shadow-sm">
      {/* Decorative top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

      <div className="flex items-center gap-4 p-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center ring-2 ring-primary/15 shadow-inner">
            <span className="text-lg font-bold tracking-tight text-primary">{initials}</span>
          </div>
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-card" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base leading-tight truncate">{tutor.user.name}</p>
          <p className="text-xs text-muted-foreground truncate mb-2.5">{tutor.user.email}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Pill icon={<DollarSign className="w-3 h-3" />} label={`$${tutor.hourlyRate}/hr`} />
            <Pill icon={<BookOpen className="w-3 h-3" />} label={`${tutor.experience} yrs exp`} />
          </div>
        </div>

        {/* Rate badge */}
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-2xl font-bold text-primary">${tutor.hourlyRate}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">per hour</p>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 border border-border/40 px-2 py-0.5 text-xs text-muted-foreground font-medium">
      {icon}
      {label}
    </span>
  );
}