"use client";

import React, { useRef, useEffect, ElementType } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
// ScrollTrigger removed — not used in this component
import dynamic from "next/dynamic";
import { Award, Clock, Sparkles, CheckCircle } from "lucide-react";
import Background from "./Background";

// Lottie — loaded client-side only
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface Feature {
  title: string;
  description: string;
  icon: ElementType;
  lottie: string;
  color: string;
  accent: string;
}

// ─────────────────────────────────────────────────────────────────
// FEATURES lives here in the Client Component — NOT passed as props
// from the Server Component, because React component references
// (icon: Award, etc.) cannot be serialised across the boundary.
// ─────────────────────────────────────────────────────────────────
const FEATURES: Feature[] = [
  {
    title: "Verified Expert Tutors",
    description: "All tutors are thoroughly vetted and verified professionals",
    icon: Award,
    lottie: "https://assets2.lottiefiles.com/packages/lf20_touohxv0.json",
    color: "from-violet-500/20 to-purple-500/10",
    accent: "#8b5cf6",
  },
  {
    title: "Flexible Scheduling",
    description: "Book sessions that fit your schedule, anytime, anywhere",
    icon: Clock,
    lottie: "https://assets2.lottiefiles.com/packages/lf20_szlepvdh.json",
    color: "from-blue-500/20 to-cyan-500/10",
    accent: "#3b82f6",
  },
  {
    title: "Personalized Learning",
    description: "One-on-one sessions tailored to your learning style",
    icon: Sparkles,
    lottie: "https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json",
    color: "from-amber-500/20 to-orange-500/10",
    accent: "#f59e0b",
  },
  {
    title: "Money-Back Guarantee",
    description: "Not satisfied? Get a full refund within 24 hours",
    icon: CheckCircle,
    lottie: "https://assets2.lottiefiles.com/packages/lf20_uu0x8lqv.json",
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "#10b981",
  },
];

// ─────────────────────────────────────────────────────────────────
// Stat counter (GSAP)
// ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: 1200, suffix: "+", label: "Active Tutors" },
  { value: 50, suffix: "k+", label: "Students Helped" },
  { value: 4.9, suffix: "/5", label: "Avg. Rating", decimal: true },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

function StatCounter({
  value,
  suffix,
  label,
  decimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}) {
  const elRef = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;

    // Use a plain proxy object captured in closure — avoids the broken
    // `this.targets()` pattern and gives gsap.fromTo its required 3rd arg.
    const proxy = { val: 0 };

    gsap.fromTo(
      proxy,                   // 1️⃣ target
      { val: 0 },             // 2️⃣ fromVars  ← was missing, causing both errors
      {                        // 3️⃣ toVars
        val: value,
        duration: 1.8,
        ease: "power2.out",
        onUpdate() {
          if (elRef.current) {
            elRef.current.textContent = decimal
              ? proxy.val.toFixed(1)
              : Math.round(proxy.val).toString();
          }
        },
      }
    );
  }, [inView, value, decimal]);

  return (
    <div ref={containerRef} className="text-center">
      <div className="text-4xl md:text-5xl font-black tracking-tight mb-1 text-foreground">
        <span ref={elRef}>0</span>
        <span className="text-violet-500">{suffix}</span>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Feature card with Lottie + hover glow
// ─────────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [lottieData, setLottieData] = React.useState<object | null>(null);
  const [hovered, setHovered] = React.useState(false);

  useEffect(() => {
    fetch(feature.lottie)
      .then((r) => r.json())
      .then(setLottieData)
      .catch(() => setLottieData(null));
  }, [feature.lottie]);

  const handleEnter = () => {
    setHovered(true);
    gsap.to(cardRef.current, { y: -8, duration: 0.35, ease: "power2.out" });
  };
  const handleLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="group relative text-center p-8 rounded-2xl bg-card border border-border overflow-hidden cursor-default"
        style={{
          boxShadow: hovered ? `0 20px 60px ${feature.accent}25` : undefined,
          borderColor: hovered ? feature.accent + "50" : undefined,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Lottie / icon */}
        <div className="relative z-10 mb-6">
          {lottieData ? (
            <div
              className="w-20 h-20 mx-auto"
              style={{
                filter: hovered
                  ? "drop-shadow(0 0 12px " + feature.accent + "60)"
                  : "none",
                transition: "filter 0.3s ease",
              }}
            >
              <Lottie
                animationData={lottieData}
                loop={hovered}
                autoplay={hovered}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-0 mx-auto"
              style={{ background: feature.accent + "18" }}
            >
              <Icon
                className="h-8 w-8 transition-all duration-300"
                style={{ color: feature.accent }}
              />
            </div>
          )}
        </div>

        <h3 className="relative z-10 text-xl font-bold mb-3 tracking-tight">
          {feature.title}
        </h3>
        <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main export — no props needed anymore
// ─────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <>
      {/* Stats strip */}
      <Background
        as="section"
        variant="solid"
        grid={false}
        decorations={false}
        accent={false}
        animate
        className="py-14 border-y border-border"
      >
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 divide-x divide-border">
            {STATS.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </Background>

      {/* Features grid */}
      <Background
        as="section"
        variant="default"
        grid
        decorations
        accent
        animate
        className="py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-violet-500 mb-3">
              Why SkillBridge
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Why Choose SkillBridge?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make learning accessible, effective, and enjoyable
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </Background>
    </>
  );
}