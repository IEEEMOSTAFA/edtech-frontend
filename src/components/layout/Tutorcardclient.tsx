"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  RiStarFill,
  RiAwardFill,
  RiUserLine,
  RiArrowRightLine,
  RiGroupLine,
  RiVerifiedBadgeFill,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Background from "./Background";
// import { Background } from "@/components/Background";

type FeaturedTutor = {
  id: string;
  userId: string;
  hourlyRate: number;
  experience: number;
  bio?: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  user: { id: string; name: string; image?: string };
  categories?: Array<{ id: string; name: string; icon?: string }>;
};

// ─────────────────────────────────────────────────────────────────
// Star rating display
// ─────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <RiStarFill
          key={i}
          className={
            i < Math.round(rating)
              ? "text-amber-400 h-3.5 w-3.5"
              : "text-zinc-300 dark:text-zinc-600 h-3.5 w-3.5"
          }
        />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Tutor card — with GSAP tilt + Framer Motion entrance
// ─────────────────────────────────────────────────────────────────
function TutorMiniCard({
  tutor,
  index,
}: {
  tutor: FeaturedTutor;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // GSAP 3D tilt on mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 12,
      transformPerspective: 800,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 800 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          href={`/tutors/${tutor.userId}`}
          className="group block rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)]"
        >
          {/* Image area */}
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center">
            {tutor.user.image ? (
              <img
                src={tutor.user.image}
                alt={tutor.user.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <RiUserLine className="h-20 w-20 text-muted-foreground/20" />
            )}

            {/* Overlay shimmer on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-violet-900/30 via-transparent to-transparent"
                />
              )}
            </AnimatePresence>

            {/* Rating pill */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center gap-1 shadow-lg">
              <RiStarFill className="h-3 w-3 text-amber-400" />
              <span className="text-xs font-bold">{tutor.rating.toFixed(1)}</span>
            </div>

            {/* Featured badge */}
            {tutor.isFeatured && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <RiAwardFill className="h-3 w-3" />
                TOP
              </motion.div>
            )}

            {/* Experience badge */}
            {tutor.experience > 0 && (
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium">
                {tutor.experience}+ yrs exp
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-lg leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                {tutor.user.name}
              </h3>
              <RiVerifiedBadgeFill className="h-5 w-5 text-violet-500 shrink-0 ml-2" />
            </div>

            {/* Categories */}
            {tutor.categories && tutor.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tutor.categories.slice(0, 2).map((c) => (
                  <Badge
                    key={c.id}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-none"
                  >
                    {c.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Bio */}
            {tutor.bio && (
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {tutor.bio}
              </p>
            )}

            {/* Star rating */}
            <StarRating rating={tutor.rating} />

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <RiGroupLine className="h-4 w-4" />
                <span>{tutor.totalReviews} reviews</span>
              </div>
              <div className="font-black text-lg text-violet-600 dark:text-violet-400">
                ${tutor.hourlyRate}
                <span className="text-xs font-medium text-muted-foreground">/hr</span>
              </div>
            </div>

            {/* CTA on hover */}
            <motion.div
              initial={false}
              animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <div className="w-full py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold text-center flex items-center justify-center gap-1.5">
                  View Profile
                  <RiArrowRightLine className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 rounded-3xl border border-dashed border-border bg-muted/20"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <RiUserLine className="h-16 w-16 mx-auto mb-4 text-muted-foreground/25" />
      </motion.div>
      <p className="text-muted-foreground text-lg">
        No tutors available yet.{" "}
        <Link href="/signup" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
          Be the first to join!
        </Link>
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────
export default function TutorCardClient({ tutors }: { tutors: FeaturedTutor[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <Background
      as="section"
      variant="subtle"
      grid
      decorations
      accent
      className="py-20"
    >
      <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-violet-500 mb-2">
              Meet our experts
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
              Featured Tutors
            </h2>
            <p className="text-lg text-muted-foreground max-w-sm">
              Top-rated tutors ready to help you succeed
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-violet-200 dark:border-violet-900 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-400"
            >
              <Link href="/tutors">
                View All
                <RiArrowRightLine className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Grid */}
        {tutors.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.map((tutor, i) => (
              <TutorMiniCard key={tutor.id} tutor={tutor} index={i} />
            ))}
          </div>
        )}
      </div>
    </Background>
  );
}