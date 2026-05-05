"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { ProfileInfoCard } from "./profile-info-card";
import type { StudentProfile } from "@/types/student";

// Lightweight inline Lottie — a simple spinner/pulse for loading state
const loadingLottie = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "pulse", ddd: 0,
  assets: [], layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "circle", sr: 1,
    ks: { o: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [30] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [100] }, { t: 60, s: [30] }] }, r: { a: 0, k: 0 }, p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [80, 80, 100] }, { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [110, 110, 100] }, { t: 60, s: [80, 80, 100] }] } },
    ao: 0, shapes: [{ ty: "el", s: { a: 0, k: [50, 50] }, p: { a: 0, k: [0, 0] }, nm: "el" }, { ty: "fl", c: { a: 0, k: [0.384, 0.4, 0.945, 1] }, o: { a: 0, k: 100 }, nm: "fl" }],
    ip: 0, op: 60, st: 0, bm: 0
  }]
};

interface Props {
  profile: StudentProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (payload: any) => void;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl bg-muted/60 ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function StudentProfileUI({
  profile, loading, saving, error, success, onSubmit,
}: Props) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle animated mesh gradient background
  useEffect(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, {
      backgroundPosition: "100% 100%",
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  // ─── Loading state ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10">
              <Lottie animationData={loadingLottie} loop />
            </div>
            <div className="space-y-1.5">
              <SkeletonPulse className="h-5 w-32" />
              <SkeletonPulse className="h-3.5 w-48" />
            </div>
          </div>
          <SkeletonPulse className="h-28 w-full rounded-2xl" />
          <div className="space-y-3 pt-2">
            <SkeletonPulse className="h-11 w-full" />
            <SkeletonPulse className="h-11 w-full" />
            <SkeletonPulse className="h-11 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-destructive font-medium"
        >
          Profile not found
        </motion.p>
      </div>
    );
  }

  // ─── Main UI ─────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-start justify-center py-12 px-4 overflow-hidden">
      {/* Animated mesh gradient backdrop */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.05) 0%, transparent 70%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
        }}
      />

      <motion.div
        className="relative w-full max-w-lg space-y-8 z-10"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal information
          </p>
        </motion.header>

        {/* Info card */}
        <ProfileInfoCard profile={profile} />

        {/* Separator with fade */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Separator className="bg-border/50" />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProfileForm
            profile={profile}
            saving={saving}
            error={error}
            success={success}
            onSubmit={onSubmit}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}





// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// // import { ProfileInfoCard } from "./profile-info-card";
// // import { ProfileForm } from "./profile-form";
// import type { StudentProfile } from "@/types/student";
// import { ProfileForm } from "./profile-form";
// import { ProfileInfoCard } from "./profile-info-card";

// interface Props {
//   profile: StudentProfile | null;
//   loading: boolean;
//   saving: boolean;
//   error: string | null;
//   success: boolean;
//   onSubmit: (payload: any) => void;
// }

// export default function StudentProfileUI({
//   profile,
//   loading,
//   saving,
//   error,
//   success,
//   onSubmit,
// }: Props) {
//   if (loading) {
//     return (
//       <div className="container max-w-lg py-10 space-y-4">
//         <Skeleton className="h-8 w-40" />
//         <Skeleton className="h-32 rounded-xl" />
//         <Skeleton className="h-10" />
//         <Skeleton className="h-10" />
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="container max-w-lg py-10 text-destructive">
//         Profile not found
//       </div>
//     );
//   }

//   return (
//     <div className="container max-w-lg py-10 space-y-8">
//       <header>
//         <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
//         <p className="text-sm text-muted-foreground">
//           Manage your personal information
//         </p>
//       </header>

//       <ProfileInfoCard profile={profile} />

//       <Separator />

//       <ProfileForm
//         profile={profile}
//         saving={saving}
//         error={error}
//         success={success}
//         onSubmit={onSubmit}
//       />
//     </div>
//   );
// }