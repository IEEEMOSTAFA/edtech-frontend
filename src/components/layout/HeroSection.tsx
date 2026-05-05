"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import {
  RiGraduationCapFill,
  RiTeamFill,
  RiBarChartFill,
  RiEarthFill,
  RiArrowRightLine,
  RiStarFill,
  RiSparklingFill,
  RiPlayCircleFill,
  RiShieldCheckFill,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { GlassCard } from "./Background";
// import { HeroBackground } from "./Backgroun";
import { HeroBackground, GlassCard } from "@/components/layout/Background";

gsap.registerPlugin(ScrollTrigger);

// ─── Lottie: sparkle burst (inline minimal) ───────────────────────
const sparkleLottie = {
  v: "5.7.4", fr: 24, ip: 0, op: 48, w: 48, h: 48, nm: "sparkle",
  layers: [{
    ty: 4, nm: "s", sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 8, s: [100] }, { t: 40, s: [100] }, { t: 48, s: [0] }] },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 48, s: [180] }] },
      s: { a: 1, k: [{ t: 0, s: [60, 60] }, { t: 10, s: [115, 115] }, { t: 48, s: [90, 90] }] },
      p: { a: 0, k: [24, 24, 0] }, a: { a: 0, k: [0, 0, 0] },
    },
    shapes: [
      { ty: "sr", pt: { a: 0, k: 4 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 4 }, or: { a: 0, k: 10 }, is: { a: 0, k: 0 }, os: { a: 0, k: 0 } },
      { ty: "fl", c: { a: 0, k: [0.545, 0.361, 0.965, 1] }, o: { a: 0, k: 100 }, r: 1 },
    ],
    ip: 0, op: 48, st: 0,
  }],
};

// ─── Animated counter hook ────────────────────────────────────────
function useCounter(target: number, duration = 1.8, inView: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);
  return value;
}

// ─── Pie chart data ───────────────────────────────────────────────
const pieData = [
  { label: "Tutors",    value: 500,   pct: 15, color: "#8b5cf6", icon: RiTeamFill,          display: "500+",    desc: "Expert Tutors" },
  { label: "Students",  value: 10000, pct: 47, color: "#06b6d4", icon: RiGraduationCapFill,  display: "10K+",    desc: "Students Taught" },
  { label: "Success",   value: 98,    pct: 28, color: "#10b981", icon: RiBarChartFill,       display: "98%",     desc: "Success Rate" },
  { label: "Countries", value: 50,    pct: 10, color: "#f59e0b", icon: RiEarthFill,          display: "50+",     desc: "Countries" },
];

// ─── SVG Donut / Pie chart ────────────────────────────────────────
function AnimatedPieChart({ inView }: { inView: boolean }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (inView && !drawn) {
      setTimeout(() => setDrawn(true), 200);
    }
  }, [inView, drawn]);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const R = 100;
  const r = 58; // inner radius (donut hole)

  // Build arc paths
  let cumPct = 0;
  const slices = pieData.map((d, i) => {
    const startPct = cumPct;
    cumPct += d.pct;
    const endPct = cumPct;

    const toRad = (p: number) => ((p / 100) * 360 - 90) * (Math.PI / 180);
    const x1 = cx + R * Math.cos(toRad(startPct));
    const y1 = cy + R * Math.sin(toRad(startPct));
    const x2 = cx + R * Math.cos(toRad(endPct));
    const y2 = cy + R * Math.sin(toRad(endPct));
    const ix1 = cx + r * Math.cos(toRad(startPct));
    const iy1 = cy + r * Math.sin(toRad(startPct));
    const ix2 = cx + r * Math.cos(toRad(endPct));
    const iy2 = cy + r * Math.sin(toRad(endPct));
    const large = d.pct > 50 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    // label midpoint
    const midRad = toRad(startPct + d.pct / 2);
    const lR = R + 22;
    const lx = cx + lR * Math.cos(midRad);
    const ly = cy + lR * Math.sin(midRad);

    return { ...d, path, lx, ly, idx: i };
  });

  const active = activeIdx !== null ? pieData[activeIdx] : null;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
        style={{ filter: "drop-shadow(0 0 32px rgba(139,92,246,0.18))" }}
      >
        {/* Glow ring */}
        <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="20" />

        {slices.map((s) => (
          <motion.path
            key={s.label}
            d={s.path}
            fill={s.color}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={drawn ? {
              opacity: 1,
              scale: activeIdx === s.idx ? 1.06 : 1,
              filter: activeIdx === s.idx ? `drop-shadow(0 0 12px ${s.color}88)` : "none",
            } : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.6, delay: s.idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, cursor: "pointer" }}
            onMouseEnter={() => setActiveIdx(s.idx)}
            onMouseLeave={() => setActiveIdx(null)}
          />
        ))}

        {/* Centre display */}
        <circle cx={cx} cy={cy} r={r - 2} fill="rgba(255,255,255,0.04)" />
        <circle cx={cx} cy={cy} r={r - 2} fill="url(#centreGrad)" />
        <defs>
          <radialGradient id="centreGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {active ? (
          <>
            <text x={cx} y={cy - 10} textAnchor="middle" fill={active.color} fontSize="20" fontWeight="800" fontFamily="sans-serif">
              {active.display}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="sans-serif">
              {active.desc}
            </text>
          </>
        ) : (
          <>
            <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontWeight="700" fontFamily="sans-serif">
              SyntaxSpace
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="9" fontFamily="sans-serif">
              GLOBAL REACH
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-[260px]">
        {pieData.map((d, i) => {
          const Icon = d.icon;
          return (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, x: -10 }}
              animate={drawn ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
              className="flex items-center gap-1.5 cursor-pointer group"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <Icon className="size-3 shrink-0" style={{ color: d.color }} />
              <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors truncate">{d.desc}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stat card with animated counter ─────────────────────────────
function StatCard({ stat, index, inView }: { stat: typeof pieData[0]; index: number; inView: boolean }) {
  const Icon = stat.icon;
  const count = useCounter(stat.value, 1.6 + index * 0.1, inView);
  const suffix = stat.display.includes("%") ? "%" : stat.display.includes("K") ? "K+" : "+";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard
        className="p-4 rounded-2xl group hover:border-violet-500/40 transition-all duration-300 cursor-default"
        animate={false}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}
          >
            <Icon className="size-4" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-xl font-black text-white leading-none">
              {stat.display.includes("K")
                ? count >= 1000 ? `${(count / 1000).toFixed(0)}K+` : count
                : `${count}${suffix === "K+" ? "" : suffix}`}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{stat.desc}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "-100px" });

  // GSAP: heading word-by-word entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { opacity: 0, y: 40, rotateX: -40 },
      {
        opacity: 1, y: 0, rotateX: 0,
        stagger: 0.09,
        duration: 0.7,
        ease: "back.out(1.4)",
        delay: 0.2,
        scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
      }
    );
  }, []);

  // GSAP: floating particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".hero-particle").forEach((el, i) => {
        gsap.to(el, {
          y: -18 - i * 6,
          x: (i % 2 === 0 ? 1 : -1) * (8 + i * 3),
          rotation: (i % 2 === 0 ? 1 : -1) * 15,
          duration: 2.4 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.25,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headingWords = ["Learn", "From", "The", "Best", "Tutors", "Worldwide"];

  return (
    <HeroBackground
      className="min-h-[92vh] py-24 pt-28"
      animate={false}
    >
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="hero-particle absolute rounded-full pointer-events-none"
          style={{
            width: 6 + i * 3,
            height: 6 + i * 3,
            top: `${15 + i * 12}%`,
            left: `${5 + i * 7}%`,
            background: `rgba(139,92,246,${0.12 + i * 0.04})`,
            filter: "blur(1px)",
          }}
        />
      ))}

      <div ref={sectionRef} className="mx-auto w-full max-w-7xl px-4">
        <div ref={inViewRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT CONTENT ─────────────────────────────────── */}
          <div className="space-y-7">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Badge
                variant="outline"
                className="gap-2 px-4 py-1.5 rounded-full border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wide"
              >
                <Lottie animationData={sparkleLottie} loop style={{ width: 18, height: 18 }} />
                Join 10,000+ successful students
              </Badge>
            </motion.div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-5xl md:text-[4.2rem] font-black leading-[1.08] tracking-tight"
              style={{ perspective: "600px" }}
            >
              {headingWords.map((word, i) => (
                <span
                  key={word}
                  className={`word inline-block mr-3 ${
                    word === "Best" || word === "Tutors"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400"
                      : "text-white dark:text-white text-slate-900"
                  }`}
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-base text-slate-400 dark:text-slate-400 max-w-md leading-relaxed"
            >
              Connect with verified expert tutors for personalized one-on-one sessions.
              Master any subject at your own pace, from anywhere in the world.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-7 font-semibold shadow-lg shadow-violet-900/40 transition-all gap-2 group"
              >
                <Link href="/tutors">
                  Browse Tutors
                  <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl px-7 font-semibold border-white/20 dark:border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 backdrop-blur-sm"
              >
                <Link href="/register?role=tutor">
                  <RiPlayCircleFill className="size-4 text-violet-400" />
                  Become a Tutor
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex items-center gap-5 pt-1"
            >
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=hero${i}`}
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-white/20 bg-violet-900/30"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className="size-3.5 text-yellow-400" />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-white">4.9</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">from 2,500+ reviews</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <RiShieldCheckFill className="size-4 text-emerald-400" />
                <span>Verified tutors only</span>
              </div>
            </motion.div>

            {/* Stat cards row */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {pieData.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} inView={isInView} />
              ))}
            </div>
          </div>

          {/* ── RIGHT CONTENT — Pie Chart ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <GlassCard
              className="rounded-3xl p-8 flex flex-col items-center gap-4 w-full max-w-sm mx-auto border-violet-500/20"
              animate={false}
              decorations
              grid={false}
            >
              {/* Chart header */}
              <div className="w-full flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Platform Overview</p>
                  <p className="text-sm text-white font-semibold mt-0.5">Global Impact</p>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Live
                </Badge>
              </div>

              <AnimatedPieChart inView={isInView} />

              {/* Bottom note */}
              <p className="text-[10px] text-slate-500 text-center mt-1">
                Hover segments to explore · Updated daily
              </p>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </HeroBackground>
  );
}














