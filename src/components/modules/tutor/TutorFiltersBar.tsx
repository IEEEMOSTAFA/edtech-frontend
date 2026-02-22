import { Filter, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Mathematics",
  "Science",
  "Languages",
  "Programming",
  "History",
  "Arts",
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
  { label: "Lowest Price", value: "price_asc" },
  { label: "Highest Price", value: "price_desc" },
  { label: "Most Experience", value: "experience" },
];

export function TutorFiltersBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter button */}
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 hover:bg-muted/50 transition-all">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          Filters
        </button>

        {/* Category select */}
        <select className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none pr-8 cursor-pointer"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === "All Categories" ? "" : c}>
              {c}
            </option>
          ))}
        </select>

        {/* Active filter pills (placeholder) */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          All Subjects
        </span>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap hidden sm:block">Sort by</span>
        <select className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none pr-8 cursor-pointer"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}