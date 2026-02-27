import Link from "next/link";
import {
  Star,
  Clock,
  DollarSign,
  Award,
  ChevronRight,
  User,
  BookOpen,
} from "lucide-react";
import type { Tutor } from "@/types/tutor";

interface TutorCardProps {
  tutor: Tutor;
  featured?: boolean;
}

export function TutorCard({ tutor, featured = false }: TutorCardProps) {
  const initials = tutor.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fullStars = Math.floor(tutor.rating);
  const hasHalf = tutor.rating % 1 >= 0.5;

  return (
    <div
      className={`group relative flex flex-col bg-card rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
        featured
          ? "border-amber-400/60 shadow-amber-100/40 shadow-lg dark:shadow-amber-900/20"
          : "border-border shadow-sm hover:border-primary/30"
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-sm">
          <Award className="w-2.5 h-2.5" />
          Featured
        </div>
      )}

      {/* Card Header — colored band */}
      <div
        className={`relative h-20 flex-shrink-0 ${
          featured
            ? "bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-rose-400/10"
            : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
        }`}
      >
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            color: featured ? "#f59e0b" : "var(--primary)",
          }}
        />
      </div>

      {/* Avatar — overlaps header */}
      <div className="relative -mt-10 mx-auto mb-1 z-10">
        {tutor.user.image ? (
          <img
            src={tutor.user.image}
            alt={tutor.user.name}
            className="w-20 h-20 rounded-2xl border-4 border-card object-cover shadow-md"
          />
        ) : (
          <div
            className={`w-20 h-20 rounded-2xl border-4 border-card shadow-md flex items-center justify-center text-xl font-black ${
              featured
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
            }`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-2">
        {/* Name */}
        <div className="text-center mb-3">
          <h3 className="text-base font-bold leading-tight text-foreground">{tutor.user.name}</h3>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < fullStars
                      ? "text-amber-400 fill-amber-400"
                      : i === fullStars && hasHalf
                      ? "text-amber-400 fill-amber-200"
                      : "text-muted-foreground/30 fill-muted-foreground/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground ml-0.5">{tutor.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({tutor.totalReviews} {tutor.totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* Categories */}
        {tutor.categories && tutor.categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {tutor.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </span>
            ))}
            {tutor.categories.length > 3 && (
              <span className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                +{tutor.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {tutor.bio && (
          <p className="text-xs text-muted-foreground text-center line-clamp-2 mb-4 leading-relaxed">
            {tutor.bio}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatPill icon={<Clock className="w-3.5 h-3.5" />} label="Experience" value={`${tutor.experience} yr${tutor.experience !== 1 ? "s" : ""}`} />
          <StatPill icon={<DollarSign className="w-3.5 h-3.5" />} label="Per hour" value={`$${tutor.hourlyRate}`} highlight />
        </div>

        {/* CTA */}
        <Link
          // href={`/tutors/${tutor.userId}`}
          href={`/tutors/${tutor.user.id}`}

          className={`flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 group/btn ${
            featured
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm hover:shadow-amber-300/40 hover:shadow-md hover:from-amber-500 hover:to-orange-600"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
          }`}
        >
          View Profile
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-center ${highlight ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/40"}`}>
      <div className={`flex items-center justify-center gap-1 mb-0.5 ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}