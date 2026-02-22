import { TrendingUp, LayoutGrid } from "lucide-react";

type Variant = "featured" | "all";

interface TutorSectionHeadingProps {
  variant: Variant;
  count?: number;
  hasFeatured?: boolean;
}

const config: Record<Variant, { icon: React.ReactNode; label: string; subcolor: string }> = {
  featured: {
    icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
    label: "Featured Tutors",
    subcolor: "text-amber-500",
  },
  all: {
    icon: <LayoutGrid className="w-5 h-5 text-muted-foreground" />,
    label: "Browse Tutors",
    subcolor: "text-muted-foreground",
  },
};

export function TutorSectionHeading({ variant, count, hasFeatured }: TutorSectionHeadingProps) {
  const { icon, label, subcolor } = config[variant];
  const displayLabel = variant === "all" && hasFeatured ? "All Tutors" : label;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-foreground tracking-tight">{displayLabel}</h2>
        {count !== undefined && (
          <span className={`text-sm font-medium ${subcolor} ml-1`}>({count})</span>
        )}
      </div>

      {variant === "featured" && (
        <span className="text-xs text-muted-foreground hidden sm:block">
          Hand-picked top performers
        </span>
      )}
    </div>
  );
}