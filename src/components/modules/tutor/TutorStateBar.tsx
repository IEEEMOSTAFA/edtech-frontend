import { Users, MessageSquare, Star, DollarSign } from "lucide-react";
import type { Tutor } from "@/types/tutor";

interface TutorStatsBarProps {
  tutors: Tutor[];
}

export function TutorStatsBar({ tutors }: TutorStatsBarProps) {
  const totalReviews = tutors.reduce((acc, t) => acc + t.totalReviews, 0);
  const avgRating =
    tutors.length > 0
      ? Math.round((tutors.reduce((acc, t) => acc + t.rating, 0) / tutors.length) * 10) / 10
      : 0;
  const minRate = tutors.length > 0 ? Math.min(...tutors.map((t) => t.hourlyRate)) : 0;

  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: tutors.length.toString(),
      label: "Expert Tutors",
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      value: totalReviews.toLocaleString(),
      label: "Total Reviews",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/8",
    },
    {
      icon: <Star className="w-5 h-5" />,
      value: `${avgRating}★`,
      label: "Avg Rating",
      color: "text-amber-500",
      bg: "bg-amber-500/8",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      value: `$${minRate}+`,
      label: "Starting / hr",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/8",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-4 py-4 shadow-sm"
        >
          <div className={`${stat.bg} ${stat.color} rounded-xl p-2.5 shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className={`text-xl font-black tracking-tight leading-none ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}