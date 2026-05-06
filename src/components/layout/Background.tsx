// tested:
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
type Variant =
  | "default"    // white/40 dark:zinc-900/40 — matches footer theme
  | "subtle"     // lighter tint
  | "solid"      // fully opaque, no blur
  | "deep"       // richer dark glass
  | "aurora";    // deep dark with violet/indigo aurora gradient

interface BackgroundProps {
  children: React.ReactNode;
  /** Visual variant */
  variant?: Variant;
  /** Extra className for the outer wrapper */
  className?: string;
  /** Show floating mesh/orb decorations */
  decorations?: boolean;
  /** Show SVG grid pattern overlay */
  grid?: boolean;
  /** Show top + bottom accent lines */
  accent?: boolean;
  /** Show animated aurora blobs (used with aurora variant) */
  aurora?: boolean;
  /** Show grain/noise texture overlay */
  grain?: boolean;
  /** Framer Motion entrance animation */
  animate?: boolean;
  as?: React.ElementType;
}

// ─────────────────────────────────────────────────────────────────
// Variant map
// ─────────────────────────────────────────────────────────────────
const variantClasses: Record<Variant, string> = {
  default: "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl",
  subtle:  "bg-white/20 dark:bg-zinc-900/20 backdrop-blur-2xl",
  solid:   "bg-white dark:bg-zinc-900",
  deep:    "bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl",
  aurora:  "bg-gradient-to-br from-violet-950 via-indigo-950 to-zinc-950 backdrop-blur-3xl",
};

// ─────────────────────────────────────────────────────────────────
// SVG grid overlay
// ─────────────────────────────────────────────────────────────────
function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              className="text-violet-400/10 dark:text-violet-400/[0.06]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Floating decoration orbs
// ─────────────────────────────────────────────────────────────────
function Decorations() {
  return (
    <>
      {/* Top-left violet orb */}
      <div
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)",
          filter: "blur(48px)",
        }}
      />
      {/* Bottom-right indigo orb */}
      <div
        className="absolute -bottom-24 -right-24 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Centre warm glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Animated aurora blobs
// ─────────────────────────────────────────────────────────────────
function AuroraBlobs() {
  return (
    <>
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(167,139,250,0.18) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Grain / noise texture overlay
// ─────────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Mouse-tracking glow (GSAP)
// ─────────────────────────────────────────────────────────────────
function MouseGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      gsap.to(glow, {
        x: e.clientX - rect.left - 180,
        y: e.clientY - rect.top - 180,
        duration: 1.4,
        ease: "power3.out",
      });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return (
    <div
      ref={glowRef}
      className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 68%)",
        filter: "blur(36px)",
        top: 0,
        left: 0,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Accent lines
// ─────────────────────────────────────────────────────────────────
function AccentLine({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 h-px pointer-events-none",
        position === "top" ? "top-0" : "bottom-0"
      )}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.45) 40%, rgba(99,102,241,0.45) 60%, transparent 100%)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────
export function Background({
  children,
  variant = "default",
  className,
  decorations = true,
  grid = true,
  accent = true,
  aurora = false,
  grain = false,
  animate = true,
  as: Tag = "section",
}: BackgroundProps) {
  const containerRef = useRef<HTMLElement>(null);

  const Wrapper = animate ? motion[Tag as keyof typeof motion] ?? motion.section : Tag;

  const animProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
   
    <Wrapper
      ref={containerRef}
      {...animProps}
      className={cn(
        "relative overflow-hidden",
        "border border-white/30 dark:border-zinc-700/30",
        "shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.30)]",
        variantClasses[variant],
        className
      )}
    >
      {/* Layers — back to front */}
      {grid && <GridOverlay />}
      {aurora && <AuroraBlobs />}
      {decorations && <Decorations />}
      {decorations && <MouseGlow containerRef={containerRef as React.RefObject<HTMLElement>} />}
      {grain && <GrainOverlay />}
      {accent && <AccentLine position="top" />}
      {accent && <AccentLine position="bottom" />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Wrapper>
  );
}

// ─────────────────────────────────────────────────────────────────
// Named re-exports for convenience
// ─────────────────────────────────────────────────────────────────

/** Full-width page section with default glass theme */
export function GlassSection({
  children,
  className,
  ...props
}: Omit<BackgroundProps, "as">) {
  return (
    <Background as="section" className={cn("w-full px-6 py-20", className)} {...props}>
      {children}
    </Background>
  );
}

/** Card-sized glass panel */
export function GlassCard({
  children,
  className,
  ...props
}: Omit<BackgroundProps, "as">) {
  return (
    <Background
      as="div"
      className={cn("rounded-2xl px-6 py-8", className)}
      decorations={false}
      accent={false}
      {...props}
    >
      {children}
    </Background>
  );
}

/** Hero-sized background with all decorations on */
export function HeroBackground({
  children,
  className,
  ...props
}: Omit<BackgroundProps, "as" | "decorations" | "grid" | "accent">) {
  return (
    <Background
      as="section"
      className={cn("w-full min-h-[60vh] flex items-center px-6 py-28", className)}
      decorations
      grid
      accent
      {...props}
    >
      {children}
    </Background>
  );
}

export default Background;



















// "use client";

// import React, { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { gsap } from "gsap";
// import { cn } from "@/lib/utils";

// // ─────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────
// type Variant =
//   | "default"    // white/40 dark:zinc-900/40 — matches footer theme
//   | "subtle"     // lighter tint
//   | "solid"      // fully opaque, no blur
//   | "deep";      // richer dark glass

// interface BackgroundProps {
//   children: React.ReactNode;
//   /** Visual variant */
//   variant?: Variant;
//   /** Extra className for the outer wrapper */
//   className?: string;
//   /** Show floating mesh/orb decorations */
//   decorations?: boolean;
//   /** Show SVG grid pattern overlay */
//   grid?: boolean;
//   /** Show top + bottom accent lines */
//   accent?: boolean;
//   /** Framer Motion entrance animation */
//   animate?: boolean;
//   as?: React.ElementType;
// }

// // ─────────────────────────────────────────────────────────────────
// // Variant map
// // ─────────────────────────────────────────────────────────────────
// const variantClasses: Record<Variant, string> = {
//   default: "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl",
//   subtle:  "bg-white/20 dark:bg-zinc-900/20 backdrop-blur-2xl",
//   solid:   "bg-white dark:bg-zinc-900",
//   deep:    "bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl",
// };

// // ─────────────────────────────────────────────────────────────────
// // SVG grid overlay
// // ─────────────────────────────────────────────────────────────────
// function GridOverlay() {
//   return (
//     <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
//       <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//         <defs>
//           <pattern id="bg-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
//             <path
//               d="M 56 0 L 0 0 0 56"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="0.4"
//               className="text-violet-400/10 dark:text-violet-400/[0.06]"
//             />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#bg-grid)" />
//       </svg>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────
// // Floating decoration orbs
// // ─────────────────────────────────────────────────────────────────
// function Decorations() {
//   return (
//     <>
//       {/* Top-left violet orb */}
//       <div
//         className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)",
//           filter: "blur(48px)",
//         }}
//       />
//       {/* Bottom-right indigo orb */}
//       <div
//         className="absolute -bottom-24 -right-24 w-[340px] h-[340px] rounded-full pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%)",
//           filter: "blur(40px)",
//         }}
//       />
//       {/* Centre warm glow */}
//       <div
//         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)",
//           filter: "blur(60px)",
//         }}
//       />
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────────
// // Mouse-tracking glow (GSAP)
// // ─────────────────────────────────────────────────────────────────
// function MouseGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
//   const glowRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = containerRef.current;
//     const glow = glowRef.current;
//     if (!el || !glow) return;

//     const onMove = (e: MouseEvent) => {
//       const rect = el.getBoundingClientRect();
//       gsap.to(glow, {
//         x: e.clientX - rect.left - 180,
//         y: e.clientY - rect.top - 180,
//         duration: 1.4,
//         ease: "power3.out",
//       });
//     };

//     el.addEventListener("mousemove", onMove);
//     return () => el.removeEventListener("mousemove", onMove);
//   }, [containerRef]);

//   return (
//     <div
//       ref={glowRef}
//       className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
//       style={{
//         background:
//           "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 68%)",
//         filter: "blur(36px)",
//         top: 0,
//         left: 0,
//       }}
//     />
//   );
// }

// // ─────────────────────────────────────────────────────────────────
// // Accent lines
// // ─────────────────────────────────────────────────────────────────
// function AccentLine({ position }: { position: "top" | "bottom" }) {
//   return (
//     <div
//       className={cn(
//         "absolute inset-x-0 h-px pointer-events-none",
//         position === "top" ? "top-0" : "bottom-0"
//       )}
//       style={{
//         background:
//           "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.45) 40%, rgba(99,102,241,0.45) 60%, transparent 100%)",
//       }}
//     />
//   );
// }

// // ─────────────────────────────────────────────────────────────────
// // Main component
// // ─────────────────────────────────────────────────────────────────
// export function Background({
//   children,
//   variant = "default",
//   className,
//   decorations = true,
//   grid = true,
//   accent = true,
//   animate = true,
//   as: Tag = "section",
// }: BackgroundProps) {
//   const containerRef = useRef<HTMLElement>(null);

//   const Wrapper = animate ? motion[Tag as keyof typeof motion] ?? motion.section : Tag;

//   const animProps = animate
//     ? {
//         initial: { opacity: 0, y: 20 },
//         whileInView: { opacity: 1, y: 0 },
//         viewport: { once: true, margin: "-60px" },
//         transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
//       }
//     : {};

//   return (
   
//     <Wrapper
//       ref={containerRef}
//       {...animProps}
//       className={cn(
//         "relative overflow-hidden",
//         "border border-white/30 dark:border-zinc-700/30",
//         "shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.30)]",
//         variantClasses[variant],
//         className
//       )}
//     >
//       {/* Layers — back to front */}
//       {grid && <GridOverlay />}
//       {decorations && <Decorations />}
//       {decorations && <MouseGlow containerRef={containerRef as React.RefObject<HTMLElement>} />}
//       {accent && <AccentLine position="top" />}
//       {accent && <AccentLine position="bottom" />}

//       {/* Content */}
//       <div className="relative z-10">{children}</div>
//     </Wrapper>
//   );
// }

// // ─────────────────────────────────────────────────────────────────
// // Named re-exports for convenience
// // ─────────────────────────────────────────────────────────────────

// /** Full-width page section with default glass theme */
// export function GlassSection({
//   children,
//   className,
//   ...props
// }: Omit<BackgroundProps, "as">) {
//   return (
//     <Background as="section" className={cn("w-full px-6 py-20", className)} {...props}>
//       {children}
//     </Background>
//   );
// }

// /** Card-sized glass panel */
// export function GlassCard({
//   children,
//   className,
//   ...props
// }: Omit<BackgroundProps, "as">) {
//   return (
//     <Background
//       as="div"
//       className={cn("rounded-2xl px-6 py-8", className)}
//       decorations={false}
//       accent={false}
//       {...props}
//     >
//       {children}
//     </Background>
//   );
// }

// /** Hero-sized background with all decorations on */
// export function HeroBackground({
//   children,
//   className,
//   ...props
// }: Omit<BackgroundProps, "as" | "decorations" | "grid" | "accent">) {
//   return (
//     <Background
//       as="section"
//       className={cn("w-full min-h-[60vh] flex items-center px-6 py-28", className)}
//       decorations
//       grid
//       accent
//       {...props}
//     >
//       {children}
//     </Background>
//   );
// }

// export default Background;