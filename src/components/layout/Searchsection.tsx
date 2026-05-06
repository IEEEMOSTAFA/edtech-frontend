"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring as useFramerSpring,
} from "framer-motion";

import { Search, ArrowRight, Sparkles, TrendingUp, BookOpen, X } from "lucide-react";
import {
  FaCode, FaFlask, FaMusic, FaPalette, FaGlobeAsia,
  FaCalculator, FaDumbbell, FaCamera, FaChartLine,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Category } from "@/types/admin";
// import { Background } from "@/components/Background";
import { cn } from "@/lib/utils";
import Background from "./Background";

// ─── Constants ────────────────────────────────────────────────────────────────
const TRENDING_SEARCHES = [
  "Mathematics", "Python", "English", "IELTS",
  "Physics", "Graphic Design", "Data Science", "Spanish",
];

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  coding:   <FaCode />,
  science:  <FaFlask />,
  music:    <FaMusic />,
  art:      <FaPalette />,
  language: <FaGlobeAsia />,
  math:     <FaCalculator />,
  fitness:  <FaDumbbell />,
  photo:    <FaCamera />,
  business: <FaChartLine />,
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: [0.4, 0.85, 0.4], scale: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="w-12 h-12 bg-muted rounded-xl mx-auto mb-4" />
          <div className="h-4 bg-muted rounded-lg w-3/4 mx-auto mb-2" />
          <div className="h-3 bg-muted rounded-lg w-1/2 mx-auto" />
        </motion.div>
      ))}
    </>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
// ✅ শুধু Framer Motion — React Spring নেই এখানে
function SearchInput({
  value, onChange, onKeyPress, onClear,
  isFocused, onFocus, onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClear: () => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: isFocused
          ? "0 0 0 2px rgba(139,92,246,0.40), 0 8px 40px rgba(139,92,246,0.18)"
          : "0 2px 20px rgba(0,0,0,0.06)",
      }}
      transition={{ duration: 0.3 }}
      className="flex gap-2 p-2 bg-background rounded-2xl border border-border/60 overflow-hidden"
    >
      <div className="flex-1 flex items-center gap-3 px-4">
        <motion.div
          animate={isFocused ? { rotate: [0, -12, 12, -6, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.45 }}
        >
          <Search className="h-5 w-5 text-violet-500 flex-shrink-0" />
        </motion.div>

        <input
          type="text"
          placeholder="Search tutors, subjects, skills…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base py-2 min-w-0"
        />

        <AnimatePresence>
          {value.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={onClear}
              type="button"
              className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Button
        size="lg"
        type="button"
        className="px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 shadow-none gap-2 flex-shrink-0"
      >
        <span>Search</span>
        <motion.div
          animate={isFocused ? { x: [0, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.7, repeat: isFocused ? Infinity : 0, repeatDelay: 1.2 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </Button>
    </motion.div>
  );
}

// ─── Trending Chip — শুধু Framer Motion ──────────────────────────────────────
function TrendingChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      onClick={onClick}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        bg-muted hover:bg-violet-100 dark:hover:bg-violet-950/40
        text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300
        border border-transparent hover:border-violet-300/50 transition-colors cursor-pointer"
    >
      <TrendingUp className="h-3 w-3 flex-shrink-0" />
      {label}
    </motion.button>
  );
}

// ─── Category Card — শুধু Framer Motion (React Spring মিশ্রণ নেই) ─────────────
function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);
  const springRotateX = useFramerSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useFramerSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  const iconKey = Object.keys(CATEGORY_ICON_MAP).find((k) =>
    category.name.toLowerCase().includes(k)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 600 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* ✅ শুধু motion.div — animated.div নেই এই subtree তে */}
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={`/tutors?category=${encodeURIComponent(category.name)}`}
          className={cn(
            "group flex flex-col items-center p-6 rounded-2xl relative overflow-hidden",
            "bg-card border border-border",
            "hover:border-violet-400/60 hover:bg-violet-50/30 dark:hover:bg-violet-950/20",
            "transition-colors duration-300"
          )}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: hovered ? "120%" : "-100%" }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.10) 50%, transparent 65%)",
            }}
          />

          {/* Icon */}
          <motion.div
            animate={
              hovered
                ? { scale: 1.22, rotate: [-4, 4, -2, 0], y: -2 }
                : { scale: 1, rotate: 0, y: 0 }
            }
            transition={{ duration: 0.4 }}
            className="text-3xl mb-3 text-violet-500"
          >
            {iconKey ? CATEGORY_ICON_MAP[iconKey] : <span>{category.icon || "📚"}</span>}
          </motion.div>

          <h3 className="font-semibold text-sm text-center leading-tight mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 text-center mt-0.5">
              {category.description}
            </p>
          )}

          {/* Bottom dot */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-500"
            initial={{ scale: 0, opacity: 0 }}
            animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Section Header — GSAP char animation (dynamic import = SSR safe) ─────────
function SectionHeader() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // ✅ Dynamic import করলে Next.js SSR এ window crash করে না
    const run = async () => {
      const { gsap: g } = await import("gsap");
      const { ScrollTrigger: ST } = await import("gsap/ScrollTrigger");
      g.registerPlugin(ST);
      if (!headingRef.current) return;
      const chars = headingRef.current.querySelectorAll<HTMLElement>(".char");
      g.fromTo(
        chars,
        { opacity: 0, y: 28, rotateX: -75 },
        {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.022, duration: 0.65, ease: "back.out(1.5)",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );
    };
    run();
  }, []);

  const words = "Explore Popular Categories".split(" ");

  return (
    <div className="text-center mb-14">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, type: "spring", stiffness: 280 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300
          text-sm font-medium mb-6 border border-violet-200/60 dark:border-violet-800/40"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Browse by subject
      </motion.div>

      <h2
        ref={headingRef}
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ perspective: "700px" }}
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block mr-[0.28em] last:mr-0">
            {word.split("").map((char, ci) => (
              <span key={ci} className="char inline-block">{char}</span>
            ))}
          </span>
        ))}
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.38, duration: 0.55 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto"
      >
        Find expert tutors across hundreds of subjects — from STEM to arts, language to business.
      </motion.p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // GSAP entrance — dynamic import (SSR safe)
  useEffect(() => {
    const animate = async () => {
      const { gsap: g } = await import("gsap");
      if (!searchBarRef.current) return;
      g.fromTo(
        searchBarRef.current,
        { opacity: 0, y: 44, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "expo.out", delay: 0.15 }
      );
    };
    animate();
  }, []);

  useEffect(() => {
    apiFetch<ApiResponse<Category[]>>("/categories")
      .then((res) => setCategories(res.data.filter((c) => c.isActive)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q) window.location.href = `/tutors?search=${encodeURIComponent(q)}`;
  }, [searchQuery]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); },
    [handleSearch]
  );

  const handleTrending = useCallback((term: string) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    setTimeout(() => {
      window.location.href = `/tutors?search=${encodeURIComponent(term)}`;
    }, 120);
  }, []);


  const filteredSuggestions = TRENDING_SEARCHES.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* ══════════════════════ SEARCH BAR SECTION ══ */}
      <Background
        variant="subtle"
        decorations={false}
        grid={false}
        accent
        animate={false}
        as="section"
        className="py-16 border-b"
      >
        <div className="mx-auto w-full max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <BookOpen className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
              Find your perfect tutor
            </span>
          </motion.div>

          <div ref={searchBarRef} className="relative" style={{ opacity: 0 }}>
            <SearchInput
              value={searchQuery}
              onChange={(v) => { setSearchQuery(v); setShowSuggestions(v.length > 0); }}
              onKeyPress={handleKeyPress}
              onClear={() => { setSearchQuery(""); setShowSuggestions(false); }}
              isFocused={isFocused}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 180)}
            />

            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
                  style={{ transformOrigin: "top" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {filteredSuggestions.map((t, i) => (
                    <motion.button
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.035 }}
                      onClick={() => handleTrending(t)}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors text-sm"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span>{t}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trending chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
              <TrendingUp className="h-3 w-3" /> Trending:
            </span>
            {TRENDING_SEARCHES.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.07, duration: 0.35, ease: "easeOut" }}
              >
                <TrendingChip
                  label={label}
                  onClick={() => handleTrending(label)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Background>

      {/* ══════════════════════ CATEGORIES SECTION ══ */}
      <Background
        variant="default"
        decorations
        grid
        accent
        as="section"
        className="py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-4">
          <SectionHeader />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              <CategorySkeleton />
            ) : categories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
              >
                <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                <p>No categories available yet.</p>
              </motion.div>
            ) : (
              categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/tutors">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl gap-2 px-8
                  border-violet-300/50 hover:border-violet-400
                  hover:bg-violet-50 dark:hover:bg-violet-950/30
                  hover:text-violet-700 dark:hover:text-violet-300
                  transition-all duration-200"
              >
                Browse all subjects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Background>
    </div>
  );
}










// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import {
//   motion,
//   AnimatePresence,
//   useMotionValue,
//   useTransform,
//   useSpring as useFramerSpring,
// } from "framer-motion";
// // ✅ React Spring শুধু trailing chips এর জন্য — Framer Motion এর সাথে SAME NODE এ মেশানো নেই
// import { useTrail, animated } from "@react-spring/web";
// import { Search, ArrowRight, Sparkles, TrendingUp, BookOpen, X } from "lucide-react";
// import {
//   FaCode, FaFlask, FaMusic, FaPalette, FaGlobeAsia,
//   FaCalculator, FaDumbbell, FaCamera, FaChartLine,
// } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import { apiFetch } from "@/lib/api";
// import type { ApiResponse, Category } from "@/types/admin";
// // import { Background } from "@/components/Background";
// import { cn } from "@/lib/utils";
// import Background from "./Background";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const TRENDING_SEARCHES = [
//   "Mathematics", "Python", "English", "IELTS",
//   "Physics", "Graphic Design", "Data Science", "Spanish",
// ];

// const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
//   coding:   <FaCode />,
//   science:  <FaFlask />,
//   music:    <FaMusic />,
//   art:      <FaPalette />,
//   language: <FaGlobeAsia />,
//   math:     <FaCalculator />,
//   fitness:  <FaDumbbell />,
//   photo:    <FaCamera />,
//   business: <FaChartLine />,
// };

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function CategorySkeleton() {
//   return (
//     <>
//       {Array.from({ length: 6 }).map((_, i) => (
//         <motion.div
//           key={i}
//           initial={{ opacity: 0, scale: 0.92 }}
//           animate={{ opacity: [0.4, 0.85, 0.4], scale: 1 }}
//           transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
//           className="p-6 rounded-2xl bg-card border border-border"
//         >
//           <div className="w-12 h-12 bg-muted rounded-xl mx-auto mb-4" />
//           <div className="h-4 bg-muted rounded-lg w-3/4 mx-auto mb-2" />
//           <div className="h-3 bg-muted rounded-lg w-1/2 mx-auto" />
//         </motion.div>
//       ))}
//     </>
//   );
// }

// // ─── Search Input ─────────────────────────────────────────────────────────────
// // ✅ শুধু Framer Motion — React Spring নেই এখানে
// function SearchInput({
//   value, onChange, onKeyPress, onClear,
//   isFocused, onFocus, onBlur,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   onKeyPress: (e: React.KeyboardEvent) => void;
//   onClear: () => void;
//   isFocused: boolean;
//   onFocus: () => void;
//   onBlur: () => void;
// }) {
//   return (
//     <motion.div
//       animate={{
//         boxShadow: isFocused
//           ? "0 0 0 2px rgba(139,92,246,0.40), 0 8px 40px rgba(139,92,246,0.18)"
//           : "0 2px 20px rgba(0,0,0,0.06)",
//       }}
//       transition={{ duration: 0.3 }}
//       className="flex gap-2 p-2 bg-background rounded-2xl border border-border/60 overflow-hidden"
//     >
//       <div className="flex-1 flex items-center gap-3 px-4">
//         <motion.div
//           animate={isFocused ? { rotate: [0, -12, 12, -6, 0], scale: [1, 1.15, 1] } : {}}
//           transition={{ duration: 0.45 }}
//         >
//           <Search className="h-5 w-5 text-violet-500 flex-shrink-0" />
//         </motion.div>

//         <input
//           type="text"
//           placeholder="Search tutors, subjects, skills…"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onKeyPress={onKeyPress}
//           onFocus={onFocus}
//           onBlur={onBlur}
//           className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base py-2 min-w-0"
//         />

//         <AnimatePresence>
//           {value.length > 0 && (
//             <motion.button
//               initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
//               animate={{ opacity: 1, scale: 1, rotate: 0 }}
//               exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
//               transition={{ duration: 0.2 }}
//               onClick={onClear}
//               type="button"
//               className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
//             >
//               <X className="h-4 w-4" />
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </div>

//       <Button
//         size="lg"
//         type="button"
//         className="px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 shadow-none gap-2 flex-shrink-0"
//       >
//         <span>Search</span>
//         <motion.div
//           animate={isFocused ? { x: [0, 5, 0] } : { x: 0 }}
//           transition={{ duration: 0.7, repeat: isFocused ? Infinity : 0, repeatDelay: 1.2 }}
//         >
//           <ArrowRight className="h-4 w-4" />
//         </motion.div>
//       </Button>
//     </motion.div>
//   );
// }

// // ─── Trending Chip — শুধু Framer Motion ──────────────────────────────────────
// function TrendingChip({ label, onClick }: { label: string; onClick: () => void }) {
//   return (
//     <motion.button
//       whileHover={{ scale: 1.08, y: -1 }}
//       whileTap={{ scale: 0.96 }}
//       transition={{ type: "spring", stiffness: 400, damping: 18 }}
//       onClick={onClick}
//       type="button"
//       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
//         bg-muted hover:bg-violet-100 dark:hover:bg-violet-950/40
//         text-muted-foreground hover:text-violet-700 dark:hover:text-violet-300
//         border border-transparent hover:border-violet-300/50 transition-colors cursor-pointer"
//     >
//       <TrendingUp className="h-3 w-3 flex-shrink-0" />
//       {label}
//     </motion.button>
//   );
// }

// // ─── Category Card — শুধু Framer Motion (React Spring মিশ্রণ নেই) ─────────────
// function CategoryCard({ category, index }: { category: Category; index: number }) {
//   const [hovered, setHovered] = useState(false);

//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-60, 60], [8, -8]);
//   const rotateY = useTransform(x, [-60, 60], [-8, 8]);
//   const springRotateX = useFramerSpring(rotateX, { stiffness: 300, damping: 30 });
//   const springRotateY = useFramerSpring(rotateY, { stiffness: 300, damping: 30 });

//   const handleMouseMove = useCallback(
//     (e: React.MouseEvent<HTMLDivElement>) => {
//       const rect = e.currentTarget.getBoundingClientRect();
//       x.set(e.clientX - rect.left - rect.width / 2);
//       y.set(e.clientY - rect.top - rect.height / 2);
//     },
//     [x, y]
//   );

//   const handleMouseLeave = useCallback(() => {
//     x.set(0);
//     y.set(0);
//     setHovered(false);
//   }, [x, y]);

//   const iconKey = Object.keys(CATEGORY_ICON_MAP).find((k) =>
//     category.name.toLowerCase().includes(k)
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-40px" }}
//       transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
//       style={{ perspective: 600 }}
//       whileHover={{ scale: 1.05 }}
//     >
//       {/* ✅ শুধু motion.div — animated.div নেই এই subtree তে */}
//       <motion.div
//         style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
//         onMouseMove={handleMouseMove}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={handleMouseLeave}
//       >
//         <Link
//           href={`/tutors?category=${encodeURIComponent(category.name)}`}
//           className={cn(
//             "group flex flex-col items-center p-6 rounded-2xl relative overflow-hidden",
//             "bg-card border border-border",
//             "hover:border-violet-400/60 hover:bg-violet-50/30 dark:hover:bg-violet-950/20",
//             "transition-colors duration-300"
//           )}
//         >
//           {/* Shine sweep */}
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ x: "-100%" }}
//             animate={{ x: hovered ? "120%" : "-100%" }}
//             transition={{ duration: 0.65, ease: "easeInOut" }}
//             style={{
//               background:
//                 "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.10) 50%, transparent 65%)",
//             }}
//           />

//           {/* Icon */}
//           <motion.div
//             animate={
//               hovered
//                 ? { scale: 1.22, rotate: [-4, 4, -2, 0], y: -2 }
//                 : { scale: 1, rotate: 0, y: 0 }
//             }
//             transition={{ duration: 0.4 }}
//             className="text-3xl mb-3 text-violet-500"
//           >
//             {iconKey ? CATEGORY_ICON_MAP[iconKey] : <span>{category.icon || "📚"}</span>}
//           </motion.div>

//           <h3 className="font-semibold text-sm text-center leading-tight mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
//             {category.name}
//           </h3>

//           {category.description && (
//             <p className="text-xs text-muted-foreground line-clamp-1 text-center mt-0.5">
//               {category.description}
//             </p>
//           )}

//           {/* Bottom dot */}
//           <motion.div
//             className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-500"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
//             transition={{ duration: 0.18 }}
//           />
//         </Link>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Section Header — GSAP char animation (dynamic import = SSR safe) ─────────
// function SectionHeader() {
//   const headingRef = useRef<HTMLHeadingElement>(null);

//   useEffect(() => {
//     // ✅ Dynamic import করলে Next.js SSR এ window crash করে না
//     const run = async () => {
//       const { gsap: g } = await import("gsap");
//       const { ScrollTrigger: ST } = await import("gsap/ScrollTrigger");
//       g.registerPlugin(ST);
//       if (!headingRef.current) return;
//       const chars = headingRef.current.querySelectorAll<HTMLElement>(".char");
//       g.fromTo(
//         chars,
//         { opacity: 0, y: 28, rotateX: -75 },
//         {
//           opacity: 1, y: 0, rotateX: 0,
//           stagger: 0.022, duration: 0.65, ease: "back.out(1.5)",
//           scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
//         }
//       );
//     };
//     run();
//   }, []);

//   const words = "Explore Popular Categories".split(" ");

//   return (
//     <div className="text-center mb-14">
//       <motion.div
//         initial={{ opacity: 0, y: -10, scale: 0.9 }}
//         whileInView={{ opacity: 1, y: 0, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.45, type: "spring", stiffness: 280 }}
//         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
//           bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300
//           text-sm font-medium mb-6 border border-violet-200/60 dark:border-violet-800/40"
//       >
//         <Sparkles className="h-3.5 w-3.5" />
//         Browse by subject
//       </motion.div>

//       <h2
//         ref={headingRef}
//         className="text-4xl md:text-5xl font-bold mb-4"
//         style={{ perspective: "700px" }}
//       >
//         {words.map((word, wi) => (
//           <span key={wi} className="inline-block mr-[0.28em] last:mr-0">
//             {word.split("").map((char, ci) => (
//               <span key={ci} className="char inline-block">{char}</span>
//             ))}
//           </span>
//         ))}
//       </h2>

//       <motion.p
//         initial={{ opacity: 0, y: 8 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.38, duration: 0.55 }}
//         className="text-lg text-muted-foreground max-w-2xl mx-auto"
//       >
//         Find expert tutors across hundreds of subjects — from STEM to arts, language to business.
//       </motion.p>
//     </div>
//   );
// }

// // ─── Main Export ──────────────────────────────────────────────────────────────
// export default function SearchSection() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isFocused, setIsFocused] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const searchBarRef = useRef<HTMLDivElement>(null);

//   // GSAP entrance — dynamic import (SSR safe)
//   useEffect(() => {
//     const animate = async () => {
//       const { gsap: g } = await import("gsap");
//       if (!searchBarRef.current) return;
//       g.fromTo(
//         searchBarRef.current,
//         { opacity: 0, y: 44, scale: 0.97 },
//         { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "expo.out", delay: 0.15 }
//       );
//     };
//     animate();
//   }, []);

//   useEffect(() => {
//     apiFetch<ApiResponse<Category[]>>("/categories")
//       .then((res) => setCategories(res.data.filter((c) => c.isActive)))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const handleSearch = useCallback(() => {
//     const q = searchQuery.trim();
//     if (q) window.location.href = `/tutors?search=${encodeURIComponent(q)}`;
//   }, [searchQuery]);

//   const handleKeyPress = useCallback(
//     (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); },
//     [handleSearch]
//   );

//   const handleTrending = useCallback((term: string) => {
//     setSearchQuery(term);
//     setShowSuggestions(false);
//     setTimeout(() => {
//       window.location.href = `/tutors?search=${encodeURIComponent(term)}`;
//     }, 120);
//   }, []);

//   // ✅ React Spring useTrail — animated.div এ শুধু, কোনো motion parent নেই
//   const trail = useTrail(TRENDING_SEARCHES.length, {
//     from: { opacity: 0, x: -14 },
//     to:   { opacity: 1,  x: 0   },
//     config: { tension: 280, friction: 22 },
//     delay: 800,
//   });

//   const filteredSuggestions = TRENDING_SEARCHES.filter((t) =>
//     t.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       {/* ══════════════════════ SEARCH BAR SECTION ══ */}
//       <Background
//         variant="subtle"
//         decorations={false}
//         grid={false}
//         accent
//         animate={false}
//         as="section"
//         className="py-16 border-b"
//       >
//         <div className="mx-auto w-full max-w-3xl px-4">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex items-center justify-center gap-2 mb-5"
//           >
//             <BookOpen className="h-4 w-4 text-violet-500" />
//             <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
//               Find your perfect tutor
//             </span>
//           </motion.div>

//           <div ref={searchBarRef} className="relative" style={{ opacity: 0 }}>
//             <SearchInput
//               value={searchQuery}
//               onChange={(v) => { setSearchQuery(v); setShowSuggestions(v.length > 0); }}
//               onKeyPress={handleKeyPress}
//               onClear={() => { setSearchQuery(""); setShowSuggestions(false); }}
//               isFocused={isFocused}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setTimeout(() => setIsFocused(false), 180)}
//             />

//             <AnimatePresence>
//               {showSuggestions && filteredSuggestions.length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
//                   animate={{ opacity: 1, y: 0, scaleY: 1 }}
//                   exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
//                   style={{ transformOrigin: "top" }}
//                   className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50"
//                 >
//                   {filteredSuggestions.map((t, i) => (
//                     <motion.button
//                       key={t}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: i * 0.035 }}
//                       onClick={() => handleTrending(t)}
//                       type="button"
//                       className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors text-sm"
//                     >
//                       <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
//                       <span>{t}</span>
//                     </motion.button>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Trending chips */}
//           <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
//             <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
//               <TrendingUp className="h-3 w-3" /> Trending:
//             </span>
//             {trail.map(({ opacity, x }, i) => (
//               <animated.div
//                 key={TRENDING_SEARCHES[i]}
//                 style={{ opacity, transform: x.to((v) => `translateX(${v}px)`) }}
//               >
//                 <TrendingChip
//                   label={TRENDING_SEARCHES[i]}
//                   onClick={() => handleTrending(TRENDING_SEARCHES[i])}
//                 />
//               </animated.div>
//             ))}
//           </div>
//         </div>
//       </Background>

//       {/* ══════════════════════ CATEGORIES SECTION ══ */}
//       <Background
//         variant="default"
//         decorations
//         grid
//         accent
//         as="section"
//         className="py-24"
//       >
//         <div className="mx-auto w-full max-w-7xl px-4">
//           <SectionHeader />

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {loading ? (
//               <CategorySkeleton />
//             ) : categories.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="col-span-full text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
//               >
//                 <BookOpen className="h-8 w-8 text-muted-foreground/40" />
//                 <p>No categories available yet.</p>
//               </motion.div>
//             ) : (
//               categories.map((category, index) => (
//                 <CategoryCard key={category.id} category={category} index={index} />
//               ))
//             )}
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.35, duration: 0.5 }}
//             className="mt-12 text-center"
//           >
//             <Link href="/tutors">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="rounded-xl gap-2 px-8
//                   border-violet-300/50 hover:border-violet-400
//                   hover:bg-violet-50 dark:hover:bg-violet-950/30
//                   hover:text-violet-700 dark:hover:text-violet-300
//                   transition-all duration-200"
//               >
//                 Browse all subjects
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </Background>
//     </div>
//   );
// }

