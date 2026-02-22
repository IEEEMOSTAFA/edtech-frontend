import { Search } from "lucide-react";

interface TutorHeroSectionProps {
  tutorCount: number;
}

export function TutorHeroSection({ tutorCount }: TutorHeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* Label pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {tutorCount} Tutors Available
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-none">
          Find Your Perfect{" "}
          <span className="relative inline-block">
            Tutor
            <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-amber-400 opacity-80" />
          </span>
        </h1>

        <p className="text-lg text-primary-foreground/70 mb-10 max-w-lg mx-auto">
          Connect with verified experts and accelerate your learning journey
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-2xl bg-white shadow-2xl shadow-black/20 overflow-hidden ring-4 ring-white/20">
            <Search className="absolute left-5 w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder='Search by subject, name, or expertise…'
              className="w-full pl-14 pr-5 py-4 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none bg-transparent"
            />
            <button className="shrink-0 mr-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
          <p className="text-primary-foreground/50 text-xs mt-3">
            Try: &ldquo;Math&rdquo; · &ldquo;Physics&rdquo; · &ldquo;Python&rdquo; · &ldquo;English&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}