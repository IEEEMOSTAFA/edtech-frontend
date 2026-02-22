export function BookingPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-lg animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-44 bg-muted rounded-lg mb-2" />
        <div className="h-4 w-60 bg-muted rounded" />
      </div>

      {/* Tutor card */}
      <div className="rounded-2xl border bg-card overflow-hidden mb-6">
        <div className="h-1 w-full bg-muted" />
        <div className="flex items-center gap-4 p-5">
          <div className="w-14 h-14 rounded-2xl bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted rounded" />
            <div className="flex gap-2 mt-1">
              <div className="h-5 w-20 bg-muted rounded-full" />
              <div className="h-5 w-24 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        <div>
          <div className="h-4 w-36 bg-muted rounded mb-2" />
          <div className="h-11 bg-muted rounded-xl" />
        </div>
        <div>
          <div className="h-4 w-20 bg-muted rounded mb-2" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-24 bg-muted rounded-2xl" />
        <div>
          <div className="h-4 w-16 bg-muted rounded mb-2" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
        <div className="h-12 bg-muted rounded-xl" />
      </div>
    </div>
  );
}