import { Users, RefreshCw } from "lucide-react";

export function TutorEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
      <div className="mb-4 flex w-20 h-20 items-center justify-center rounded-2xl bg-muted">
        <Users className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No tutors found</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        There are no tutors matching your criteria right now. Try adjusting your filters or check back soon.
      </p>
      <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors shadow-sm">
        <RefreshCw className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );
}