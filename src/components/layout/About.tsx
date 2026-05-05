"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import {
  RiCrosshair2Line as RiTargetLine,
  RiTimerLine as RiTimeLine,
  RiMedalLine as RiAwardLine,
  RiBookOpenLine,
  RiGroupLine as RiTeamLine,
  RiShieldCheckLine,
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiSearchLine,
  RiCalendar2Line as RiCalendarCheckLine,
  RiLightbulbLine as RiLightbulbFlashLine,
  RiGlobalLine,
  RiMagicLine as RiSparklingLine,
  RiCodeSSlashLine,
  RiStarFill,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Background, GlassCard, GlassSection } from "@/components/layout/Background";

gsap.registerPlugin(ScrollTrigger);

// ── Lottie: minimal glow pulse ────────────────────────────────────
const pulseLottie = {
  v: "5.7.4", fr: 30, ip: 0, op: 90, w: 56, h: 56, nm: "glow",
  layers: [{
    ty: 4, nm: "ring", sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [40] }, { t: 45, s: [100] }, { t: 90, s: [40] }] },
      s: { a: 1, k: [{ t: 0, s: [70, 70] }, { t: 45, s: [110, 110] }, { t: 90, s: [70, 70] }] },
      p: { a: 0, k: [28, 28, 0] }, a: { a: 0, k: [0, 0, 0] }, r: { a: 0, k: 0 },
    },
    shapes: [
      { ty: "el", s: { a: 0, k: [22, 22] }, p: { a: 0, k: [0, 0] } },
      { ty: "st", c: { a: 0, k: [0.545, 0.361, 0.965, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2 },
      { ty: "fl", c: { a: 0, k: [0.545, 0.361, 0.965, 0.15] }, o: { a: 0, k: 100 }, r: 1 },
    ],
    ip: 0, op: 90, st: 0,
  }],
};

const checkLottie = {
  v: "5.7.4", fr: 30, ip: 0, op: 40, w: 40, h: 40, nm: "check",
  layers: [{
    ty: 4, nm: "c", sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 8, s: [100] }, { t: 40, s: [100] }] },
      s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 12, s: [120, 120] }, { t: 18, s: [95, 95] }, { t: 40, s: [100, 100] }] },
      p: { a: 0, k: [20, 20, 0] }, a: { a: 0, k: [0, 0, 0] }, r: { a: 0, k: 0 },
    },
    shapes: [
      { ty: "el", s: { a: 0, k: [28, 28] }, p: { a: 0, k: [0, 0] } },
      { ty: "fl", c: { a: 0, k: [0.063, 0.725, 0.506, 1] }, o: { a: 0, k: 100 }, r: 1 },
    ],
    ip: 0, op: 40, st: 0,
  }],
};

// ── Data ──────────────────────────────────────────────────────────
const missionFeatures = [
  { icon: RiTargetLine,      title: "Personalized Learning",  desc: "One-on-one sessions tailored to your unique learning style and pace." },
  { icon: RiTimeLine,        title: "Flexible Scheduling",    desc: "Learn on your terms — pick slots that fit your calendar, any timezone." },
  { icon: RiAwardLine,       title: "Verified Experts",       desc: "Every tutor is vetted for qualifications and rated by real students." },
];

const steps = [
  { num: "01", icon: RiSearchLine,        title: "Browse Tutors",   desc: "Search by subject, rating, price and availability. Read real student reviews to find your perfect match." },
  { num: "02", icon: RiCalendarCheckLine, title: "Book a Session",  desc: "Select a time slot and confirm instantly. Get calendar reminders and pre-session preparation tips." },
  { num: "03", icon: RiLightbulbFlashLine,title: "Start Learning",  desc: "Attend your personalised session, master new skills, and leave a review to help the community." },
];

const tutorPerks = [
  { title: "Manage Your Schedule",  desc: "Set availability and teach when it works for you." },
  { title: "Build Your Profile",    desc: "Showcase expertise and earn verified student reviews." },
  { title: "Track Your Sessions",   desc: "View all bookings and teaching history in one dashboard." },
  { title: "Set Your Rates",        desc: "Full control over pricing — you keep what you earn." },
  { title: "Growth Analytics",      desc: "Deep-dive metrics on sessions, ratings and earnings." },
  { title: "Priority Support",      desc: "Dedicated tutor success team available 7 days a week." },
];

const platformFeatures = [
  { icon: RiBookOpenLine,    title: "Diverse Subjects",     desc: "Math to music, coding to cooking — tutors for every subject imaginable." },
  { icon: RiTeamLine,        title: "Community Driven",     desc: "Authentic reviews and ratings from real students help you decide with confidence." },
  { icon: RiShieldCheckLine, title: "Safe & Secure",        desc: "Admin-monitored platform ensuring a quality, trusted environment for all." },
  { icon: RiGlobalLine,      title: "Global Reach",         desc: "Connect with tutors and learners from 50+ countries around the world." },
  { icon: RiSparklingLine,   title: "AI-Matched Sessions",  desc: "Smart recommendations surface tutors that align with your learning profile." },
  { icon: RiCodeSSlashLine,  title: "Tech-First Platform",  desc: "Cutting-edge tools built for seamless, distraction-free learning sessions." },
];

const stats = [
  { value: "500+",   label: "Expert Tutors",    color: "#8b5cf6" },
  { value: "10K+",   label: "Students Taught",  color: "#06b6d4" },
  { value: "98%",    label: "Success Rate",     color: "#10b981" },
  { value: "50+",    label: "Countries",        color: "#f59e0b" },
];

// ── Reusable section heading ──────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-14"
    >
      <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold mb-4 px-4 py-1.5">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

// ── Timeline step ─────────────────────────────────────────────────
function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = step.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <GlassCard className="rounded-2xl p-7 h-full group hover:border-violet-500/40 transition-all duration-300" animate={false} decorations={false} accent={false}>
        {/* Number watermark */}
        <span className="absolute top-4 right-5 text-6xl font-black text-violet-500/[0.07] select-none pointer-events-none leading-none">
          {step.num}
        </span>
        <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-5 group-hover:bg-violet-500/25 transition-colors">
          <Icon className="size-6 text-violet-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
      </GlassCard>
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-violet-500/40 to-transparent z-10" />
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  // GSAP hero title reveal
  useEffect(() => {
    if (!heroTitleRef.current) return;
    const chars = heroTitleRef.current.querySelectorAll(".char");
    gsap.fromTo(chars,
      { opacity: 0, y: 50, rotateX: -50, filter: "blur(4px)" },
      {
        opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
        stagger: 0.03, duration: 0.65, ease: "back.out(1.5)", delay: 0.15,
      }
    );
  }, []);

  // GSAP: floating orbs
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".about-orb").forEach((el, i) => {
        gsap.to(el, {
          y: -20 - i * 8, x: (i % 2 ? 1 : -1) * 12,
          duration: 3 + i * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.4,
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // GSAP: stat counters on scroll
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  const heroText = "About SyntaxSpace";

  return (
    <div ref={pageRef} className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <Background
        as="section"
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        decorations grid accent animate={false}
      >
        {/* Floating orbs */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="about-orb absolute rounded-full pointer-events-none"
            style={{
              width: 80 + i * 40, height: 80 + i * 40,
              top: `${10 + i * 15}%`, left: `${60 + i * 8}%`,
              background: `rgba(139,92,246,${0.06 + i * 0.02})`,
              filter: "blur(28px)",
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-6"
          >
            <Lottie animationData={pulseLottie} loop style={{ width: 32, height: 32 }} />
            <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold px-4 py-1.5">
              Our Story
            </Badge>
          </motion.div>

          <h1
            ref={heroTitleRef}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
            style={{ perspective: "700px" }}
          >
            {heroText.split("").map((ch, i) => (
              <span
                key={i}
                className={`char inline-block ${ch === " " ? "mr-4" : ""} ${
                  i >= heroText.indexOf("S", 6)
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400"
                    : "text-white"
                }`}
                style={{ opacity: 0 }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-8"
          >
            Connecting passionate learners with expert tutors to bridge the gap between
            aspiration and achievement — one session at a time.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-wrap gap-8 pt-2"
          >
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Background>

      {/* ════════════════════════════════════════════════════════
          MISSION
      ════════════════════════════════════════════════════════ */}
      <GlassSection className="py-24 px-4" decorations grid={false} accent>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold mb-5 px-4 py-1.5">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
                Making Quality Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Accessible to All</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                SyntaxSpace was created with a simple yet powerful vision: make quality education accessible to everyone, everywhere. We believe learning should be personalised, flexible, and inspiring.
              </p>
              <p className="text-slate-400 leading-relaxed">
                By connecting students with expert tutors across diverse subjects, we're building a community where knowledge flows freely and every learner can reach their full potential.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div className="space-y-4">
              {missionFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassCard className="rounded-2xl p-5 group hover:border-violet-500/40 transition-all duration-300" animate={false} decorations={false} accent={false}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 group-hover:bg-violet-500/25 transition-colors">
                          <Icon className="size-5 text-violet-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1 text-sm">{f.title}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassSection>

      {/* ════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Process"
            title={<>How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SyntaxSpace</span> Works</>}
            subtitle="From discovery to mastery in three simple steps. We've made the learning journey as smooth as possible."
          />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector bar behind cards */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent -translate-y-1/2 pointer-events-none" />
            {steps.map((s, i) => <StepCard key={s.num} step={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOR TUTORS
      ════════════════════════════════════════════════════════ */}
      <GlassSection className="py-24 px-4" decorations accent grid={false}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[11px] tracking-widest uppercase font-bold mb-5 px-4 py-1.5">
                For Tutors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
                Share Knowledge.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Build Your Brand.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Share your knowledge, build your reputation, and earn income on your own schedule. SyntaxSpace provides the platform and the students — you bring the expertise.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 font-semibold shadow-lg shadow-violet-900/40 gap-2 group">
                  <Link href="/register?role=tutor">
                    Become a Tutor
                    <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
              {/* Rating trust */}
              <div className="flex items-center gap-2 mt-6">
                {[...Array(5)].map((_, i) => <RiStarFill key={i} className="size-4 text-yellow-400" />)}
                <span className="text-sm text-slate-400 ml-1">4.9 avg tutor rating · 2,500+ reviews</span>
              </div>
            </motion.div>

            {/* Right — perks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tutorPerks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <GlassCard className="rounded-xl p-4 h-full group hover:border-cyan-500/30 transition-all duration-300" animate={false} decorations={false} accent={false}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <Lottie animationData={checkLottie} loop={false} style={{ width: 20, height: 20 }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{p.title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </GlassSection>

      {/* ════════════════════════════════════════════════════════
          PLATFORM FEATURES
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Features"
            title={<>Everything You <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">Need to Succeed</span></>}
            subtitle="A fully-featured platform designed around the needs of learners and educators alike."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard className="rounded-2xl p-6 h-full group hover:border-violet-500/40 transition-all duration-300 cursor-default" animate={false} decorations={false} accent={false}>
                    <div className="w-11 h-11 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/22 group-hover:scale-110 transition-all duration-300">
                      <Icon className="size-5 text-violet-400" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <Background
        as="section"
        className="py-24 px-4"
        decorations grid accent animate={false}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-5">
              <Lottie animationData={pulseLottie} loop style={{ width: 48, height: 48 }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Start Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                Learning Journey?
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of students and tutors already using SyntaxSpace to achieve their educational goals — and build the future they deserve.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-8 font-semibold shadow-lg shadow-violet-900/40 gap-2 group">
                <Link href="/signup">
                  Get Started Free
                  <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold border-white/15 bg-white/5 hover:bg-white/10 text-white gap-2 backdrop-blur-sm">
                <Link href="/tutors">
                  Browse Tutors
                </Link>
              </Button>
            </div>

            <Separator className="my-10 bg-white/5" />

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {["No credit card required", "Free first session", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <RiCheckboxCircleFill className="size-4 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </Background>
    </div>
  );
}



















// "use client";

// import React, { useEffect, useRef } from "react";
// import Link from "next/link";
// import { motion, useInView } from "framer-motion";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lottie from "lottie-react";
// import {
//   // RiTargetLine,
//   RiTimeLine,
//   RiAwardLine,
//   RiBookOpenLine,
//   RiTeamLine,
//   RiShieldCheckLine,
//   RiArrowRightLine,
//   RiCheckboxCircleFill,
//   RiSearchLine,
//   RiCalendarCheckLine,
//   RiLightbulbFlashLine,
//   RiGlobalLine,
//   RiSparklingLine,
//   RiCodeSSlashLine,
//   RiStarFill,
// } from "react-icons/ri";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Background, GlassCard, GlassSection } from "@/components/layout/Background";

// gsap.registerPlugin(ScrollTrigger);

// // ── Lottie: minimal glow pulse ────────────────────────────────────
// const pulseLottie = {
//   v: "5.7.4", fr: 30, ip: 0, op: 90, w: 56, h: 56, nm: "glow",
//   layers: [{
//     ty: 4, nm: "ring", sr: 1,
//     ks: {
//       o: { a: 1, k: [{ t: 0, s: [40] }, { t: 45, s: [100] }, { t: 90, s: [40] }] },
//       s: { a: 1, k: [{ t: 0, s: [70, 70] }, { t: 45, s: [110, 110] }, { t: 90, s: [70, 70] }] },
//       p: { a: 0, k: [28, 28, 0] }, a: { a: 0, k: [0, 0, 0] }, r: { a: 0, k: 0 },
//     },
//     shapes: [
//       { ty: "el", s: { a: 0, k: [22, 22] }, p: { a: 0, k: [0, 0] } },
//       { ty: "st", c: { a: 0, k: [0.545, 0.361, 0.965, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2 },
//       { ty: "fl", c: { a: 0, k: [0.545, 0.361, 0.965, 0.15] }, o: { a: 0, k: 100 }, r: 1 },
//     ],
//     ip: 0, op: 90, st: 0,
//   }],
// };

// const checkLottie = {
//   v: "5.7.4", fr: 30, ip: 0, op: 40, w: 40, h: 40, nm: "check",
//   layers: [{
//     ty: 4, nm: "c", sr: 1,
//     ks: {
//       o: { a: 1, k: [{ t: 0, s: [0] }, { t: 8, s: [100] }, { t: 40, s: [100] }] },
//       s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 12, s: [120, 120] }, { t: 18, s: [95, 95] }, { t: 40, s: [100, 100] }] },
//       p: { a: 0, k: [20, 20, 0] }, a: { a: 0, k: [0, 0, 0] }, r: { a: 0, k: 0 },
//     },
//     shapes: [
//       { ty: "el", s: { a: 0, k: [28, 28] }, p: { a: 0, k: [0, 0] } },
//       { ty: "fl", c: { a: 0, k: [0.063, 0.725, 0.506, 1] }, o: { a: 0, k: 100 }, r: 1 },
//     ],
//     ip: 0, op: 40, st: 0,
//   }],
// };

// // ── Data ──────────────────────────────────────────────────────────
// const missionFeatures = [
//   { icon: RiTargetLine,      title: "Personalized Learning",  desc: "One-on-one sessions tailored to your unique learning style and pace." },
//   { icon: RiTimeLine,        title: "Flexible Scheduling",    desc: "Learn on your terms — pick slots that fit your calendar, any timezone." },
//   { icon: RiAwardLine,       title: "Verified Experts",       desc: "Every tutor is vetted for qualifications and rated by real students." },
// ];

// const steps = [
//   { num: "01", icon: RiSearchLine,        title: "Browse Tutors",   desc: "Search by subject, rating, price and availability. Read real student reviews to find your perfect match." },
//   { num: "02", icon: RiCalendarCheckLine, title: "Book a Session",  desc: "Select a time slot and confirm instantly. Get calendar reminders and pre-session preparation tips." },
//   { num: "03", icon: RiLightbulbFlashLine,title: "Start Learning",  desc: "Attend your personalised session, master new skills, and leave a review to help the community." },
// ];

// const tutorPerks = [
//   { title: "Manage Your Schedule",  desc: "Set availability and teach when it works for you." },
//   { title: "Build Your Profile",    desc: "Showcase expertise and earn verified student reviews." },
//   { title: "Track Your Sessions",   desc: "View all bookings and teaching history in one dashboard." },
//   { title: "Set Your Rates",        desc: "Full control over pricing — you keep what you earn." },
//   { title: "Growth Analytics",      desc: "Deep-dive metrics on sessions, ratings and earnings." },
//   { title: "Priority Support",      desc: "Dedicated tutor success team available 7 days a week." },
// ];

// const platformFeatures = [
//   { icon: RiBookOpenLine,    title: "Diverse Subjects",     desc: "Math to music, coding to cooking — tutors for every subject imaginable." },
//   { icon: RiTeamLine,        title: "Community Driven",     desc: "Authentic reviews and ratings from real students help you decide with confidence." },
//   { icon: RiShieldCheckLine, title: "Safe & Secure",        desc: "Admin-monitored platform ensuring a quality, trusted environment for all." },
//   { icon: RiGlobalLine,      title: "Global Reach",         desc: "Connect with tutors and learners from 50+ countries around the world." },
//   { icon: RiSparklingLine,   title: "AI-Matched Sessions",  desc: "Smart recommendations surface tutors that align with your learning profile." },
//   { icon: RiCodeSSlashLine,  title: "Tech-First Platform",  desc: "Cutting-edge tools built for seamless, distraction-free learning sessions." },
// ];

// const stats = [
//   { value: "500+",   label: "Expert Tutors",    color: "#8b5cf6" },
//   { value: "10K+",   label: "Students Taught",  color: "#06b6d4" },
//   { value: "98%",    label: "Success Rate",     color: "#10b981" },
//   { value: "50+",    label: "Countries",        color: "#f59e0b" },
// ];

// // ── Reusable section heading ──────────────────────────────────────
// function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-60px" });
//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 24 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
//       className="text-center mb-14"
//     >
//       <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold mb-4 px-4 py-1.5">
//         {eyebrow}
//       </Badge>
//       <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{title}</h2>
//       {subtitle && <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">{subtitle}</p>}
//     </motion.div>
//   );
// }

// // ── Timeline step ─────────────────────────────────────────────────
// function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-40px" });
//   const Icon = step.icon;
//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 30 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ delay: index * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
//       className="relative"
//     >
//       <GlassCard className="rounded-2xl p-7 h-full group hover:border-violet-500/40 transition-all duration-300" animate={false} decorations={false} accent={false}>
//         {/* Number watermark */}
//         <span className="absolute top-4 right-5 text-6xl font-black text-violet-500/[0.07] select-none pointer-events-none leading-none">
//           {step.num}
//         </span>
//         <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-5 group-hover:bg-violet-500/25 transition-colors">
//           <Icon className="size-6 text-violet-400" />
//         </div>
//         <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
//         <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
//       </GlassCard>
//       {/* Connector line */}
//       {index < steps.length - 1 && (
//         <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-violet-500/40 to-transparent z-10" />
//       )}
//     </motion.div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// export default function AboutPage() {
//   const pageRef = useRef<HTMLDivElement>(null);
//   const heroTitleRef = useRef<HTMLHeadingElement>(null);

//   // GSAP hero title reveal
//   useEffect(() => {
//     if (!heroTitleRef.current) return;
//     const chars = heroTitleRef.current.querySelectorAll(".char");
//     gsap.fromTo(chars,
//       { opacity: 0, y: 50, rotateX: -50, filter: "blur(4px)" },
//       {
//         opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
//         stagger: 0.03, duration: 0.65, ease: "back.out(1.5)", delay: 0.15,
//       }
//     );
//   }, []);

//   // GSAP: floating orbs
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.utils.toArray<HTMLElement>(".about-orb").forEach((el, i) => {
//         gsap.to(el, {
//           y: -20 - i * 8, x: (i % 2 ? 1 : -1) * 12,
//           duration: 3 + i * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.4,
//         });
//       });
//     }, pageRef);
//     return () => ctx.revert();
//   }, []);

//   // GSAP: stat counters on scroll
//   const statsRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (!statsRef.current) return;
//     const ctx = gsap.context(() => {
//       gsap.from(".stat-item", {
//         opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: "power2.out",
//         scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
//       });
//     });
//     return () => ctx.revert();
//   }, []);

//   const heroText = "About SyntaxSpace";

//   return (
//     <div ref={pageRef} className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

//       {/* ════════════════════════════════════════════════════════
//           HERO
//       ════════════════════════════════════════════════════════ */}
//       <Background
//         as="section"
//         className="relative pt-32 pb-20 px-4 overflow-hidden"
//         decorations grid accent animate={false}
//       >
//         {/* Floating orbs */}
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="about-orb absolute rounded-full pointer-events-none"
//             style={{
//               width: 80 + i * 40, height: 80 + i * 40,
//               top: `${10 + i * 15}%`, left: `${60 + i * 8}%`,
//               background: `rgba(139,92,246,${0.06 + i * 0.02})`,
//               filter: "blur(28px)",
//             }}
//           />
//         ))}

//         <div className="max-w-6xl mx-auto relative">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="flex items-center gap-2 mb-6"
//           >
//             <Lottie animationData={pulseLottie} loop style={{ width: 32, height: 32 }} />
//             <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold px-4 py-1.5">
//               Our Story
//             </Badge>
//           </motion.div>

//           <h1
//             ref={heroTitleRef}
//             className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
//             style={{ perspective: "700px" }}
//           >
//             {heroText.split("").map((ch, i) => (
//               <span
//                 key={i}
//                 className={`char inline-block ${ch === " " ? "mr-4" : ""} ${
//                   i >= heroText.indexOf("S", 6)
//                     ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400"
//                     : "text-white"
//                 }`}
//                 style={{ opacity: 0 }}
//               >
//                 {ch === " " ? "\u00A0" : ch}
//               </span>
//             ))}
//           </h1>

//           <motion.p
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7, duration: 0.5 }}
//             className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-8"
//           >
//             Connecting passionate learners with expert tutors to bridge the gap between
//             aspiration and achievement — one session at a time.
//           </motion.p>

//           {/* Stats bar */}
//           <motion.div
//             ref={statsRef}
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9, duration: 0.5 }}
//             className="flex flex-wrap gap-8 pt-2"
//           >
//             {stats.map((s) => (
//               <div key={s.label} className="stat-item">
//                 <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
//                 <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </Background>

//       {/* ════════════════════════════════════════════════════════
//           MISSION
//       ════════════════════════════════════════════════════════ */}
//       <GlassSection className="py-24 px-4" decorations grid={false} accent>
//         <div className="max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-16 items-center">
//             {/* Text */}
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] tracking-widest uppercase font-bold mb-5 px-4 py-1.5">
//                 Our Mission
//               </Badge>
//               <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
//                 Making Quality Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Accessible to All</span>
//               </h2>
//               <p className="text-slate-400 leading-relaxed mb-4">
//                 SyntaxSpace was created with a simple yet powerful vision: make quality education accessible to everyone, everywhere. We believe learning should be personalised, flexible, and inspiring.
//               </p>
//               <p className="text-slate-400 leading-relaxed">
//                 By connecting students with expert tutors across diverse subjects, we're building a community where knowledge flows freely and every learner can reach their full potential.
//               </p>
//             </motion.div>

//             {/* Feature cards */}
//             <div className="space-y-4">
//               {missionFeatures.map((f, i) => {
//                 const Icon = f.icon;
//                 return (
//                   <motion.div
//                     key={f.title}
//                     initial={{ opacity: 0, x: 30 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//                   >
//                     <GlassCard className="rounded-2xl p-5 group hover:border-violet-500/40 transition-all duration-300" animate={false} decorations={false} accent={false}>
//                       <div className="flex items-start gap-4">
//                         <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 group-hover:bg-violet-500/25 transition-colors">
//                           <Icon className="size-5 text-violet-400" />
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-white mb-1 text-sm">{f.title}</h3>
//                           <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
//                         </div>
//                       </div>
//                     </GlassCard>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </GlassSection>

//       {/* ════════════════════════════════════════════════════════
//           HOW IT WORKS
//       ════════════════════════════════════════════════════════ */}
//       <section className="py-24 px-4 bg-zinc-950/80">
//         <div className="max-w-6xl mx-auto">
//           <SectionHeading
//             eyebrow="Process"
//             title={<>How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SyntaxSpace</span> Works</>}
//             subtitle="From discovery to mastery in three simple steps. We've made the learning journey as smooth as possible."
//           />
//           <div className="grid md:grid-cols-3 gap-6 relative">
//             {/* Connector bar behind cards */}
//             <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent -translate-y-1/2 pointer-events-none" />
//             {steps.map((s, i) => <StepCard key={s.num} step={s} index={i} />)}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════════════════
//           FOR TUTORS
//       ════════════════════════════════════════════════════════ */}
//       <GlassSection className="py-24 px-4" decorations accent grid={false}>
//         <div className="max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-12 items-start">
//             {/* Left */}
//             <motion.div
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.55 }}
//             >
//               <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[11px] tracking-widest uppercase font-bold mb-5 px-4 py-1.5">
//                 For Tutors
//               </Badge>
//               <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
//                 Share Knowledge.<br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Build Your Brand.</span>
//               </h2>
//               <p className="text-slate-400 leading-relaxed mb-8">
//                 Share your knowledge, build your reputation, and earn income on your own schedule. SyntaxSpace provides the platform and the students — you bring the expertise.
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 font-semibold shadow-lg shadow-violet-900/40 gap-2 group">
//                   <Link href="/register?role=tutor">
//                     Become a Tutor
//                     <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform" />
//                   </Link>
//                 </Button>
//               </div>
//               {/* Rating trust */}
//               <div className="flex items-center gap-2 mt-6">
//                 {[...Array(5)].map((_, i) => <RiStarFill key={i} className="size-4 text-yellow-400" />)}
//                 <span className="text-sm text-slate-400 ml-1">4.9 avg tutor rating · 2,500+ reviews</span>
//               </div>
//             </motion.div>

//             {/* Right — perks grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {tutorPerks.map((p, i) => (
//                 <motion.div
//                   key={p.title}
//                   initial={{ opacity: 0, scale: 0.94 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.07, duration: 0.4 }}
//                 >
//                   <GlassCard className="rounded-xl p-4 h-full group hover:border-cyan-500/30 transition-all duration-300" animate={false} decorations={false} accent={false}>
//                     <div className="flex items-start gap-3">
//                       <div className="mt-0.5 shrink-0">
//                         <Lottie animationData={checkLottie} loop={false} style={{ width: 20, height: 20 }} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-white mb-0.5">{p.title}</p>
//                         <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
//                       </div>
//                     </div>
//                   </GlassCard>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </GlassSection>

//       {/* ════════════════════════════════════════════════════════
//           PLATFORM FEATURES
//       ════════════════════════════════════════════════════════ */}
//       <section className="py-24 px-4 bg-zinc-950/80">
//         <div className="max-w-6xl mx-auto">
//           <SectionHeading
//             eyebrow="Features"
//             title={<>Everything You <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">Need to Succeed</span></>}
//             subtitle="A fully-featured platform designed around the needs of learners and educators alike."
//           />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {platformFeatures.map((f, i) => {
//               const Icon = f.icon;
//               return (
//                 <motion.div
//                   key={f.title}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//                 >
//                   <GlassCard className="rounded-2xl p-6 h-full group hover:border-violet-500/40 transition-all duration-300 cursor-default" animate={false} decorations={false} accent={false}>
//                     <div className="w-11 h-11 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/22 group-hover:scale-110 transition-all duration-300">
//                       <Icon className="size-5 text-violet-400" />
//                     </div>
//                     <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
//                     <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
//                   </GlassCard>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════════════════
//           CTA
//       ════════════════════════════════════════════════════════ */}
//       <Background
//         as="section"
//         className="py-24 px-4"
//         decorations grid accent animate={false}
//       >
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex justify-center mb-5">
//               <Lottie animationData={pulseLottie} loop style={{ width: 48, height: 48 }} />
//             </div>
//             <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
//               Ready to Start Your<br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
//                 Learning Journey?
//               </span>
//             </h2>
//             <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto leading-relaxed">
//               Join thousands of students and tutors already using SyntaxSpace to achieve their educational goals — and build the future they deserve.
//             </p>

//             <div className="flex flex-wrap gap-3 justify-center">
//               <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-8 font-semibold shadow-lg shadow-violet-900/40 gap-2 group">
//                 <Link href="/signup">
//                   Get Started Free
//                   <RiArrowRightLine className="size-4 group-hover:translate-x-0.5 transition-transform" />
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold border-white/15 bg-white/5 hover:bg-white/10 text-white gap-2 backdrop-blur-sm">
//                 <Link href="/tutors">
//                   Browse Tutors
//                 </Link>
//               </Button>
//             </div>

//             <Separator className="my-10 bg-white/5" />

//             <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
//               {["No credit card required", "Free first session", "Cancel anytime"].map((t) => (
//                 <span key={t} className="flex items-center gap-1.5">
//                   <RiCheckboxCircleFill className="size-4 text-emerald-500" />
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </Background>
//     </div>
//   );
// }

















// import React from 'react';
// import { BookOpen, Users, Award, Target, Clock, Shield } from 'lucide-react';

// export default function AboutSkill() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
//         <div className="max-w-6xl mx-auto px-4">
//           <h1 className="text-5xl font-bold mb-6">About SkillBridge</h1>
//           <p className="text-xl text-blue-100 max-w-3xl">
//             Connecting passionate learners with expert tutors to bridge the gap between aspiration and achievement.
//           </p>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="max-w-6xl mx-auto px-4 py-16">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
//             <p className="text-gray-700 text-lg leading-relaxed mb-4">
//               SkillBridge was created with a simple yet powerful vision: to make quality education accessible to everyone, anywhere. We believe that learning should be personalized, flexible, and inspiring.
//             </p>
//             <p className="text-gray-700 text-lg leading-relaxed">
//               By connecting students with expert tutors across diverse subjects, we arre building a community where knowledge flows freely and every learner can reach their full potential.
//             </p>
//           </div>
//           <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl">
//             <div className="space-y-6">
//               <div className="flex items-start gap-4">
//                 <Target className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Personalized Learning</h3>
//                   <p className="text-gray-600">One-on-one sessions tailored to your unique learning style</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Flexible Scheduling</h3>
//                   <p className="text-gray-600">Learn at your own pace, on your own schedule</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Verified Experts</h3>
//                   <p className="text-gray-600">Learn from qualified tutors with proven track records</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How SkillBridge Works</h2>
          
//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             <div className="bg-white p-8 rounded-xl shadow-sm">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <span className="text-blue-600 font-bold text-xl">1</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse Tutors</h3>
//               <p className="text-gray-600">
//                 Search our diverse pool of expert tutors by subject, rating, price, and availability. Read reviews from other students to find your perfect match.
//               </p>
//             </div>

//             <div className="bg-white p-8 rounded-xl shadow-sm">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <span className="text-blue-600 font-bold text-xl">2</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Book a Session</h3>
//               <p className="text-gray-600">
//                 Select a convenient time slot and book your session instantly. Get immediate confirmation and prepare for your learning journey.
//               </p>
//             </div>

//             <div className="bg-white p-8 rounded-xl shadow-sm">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <span className="text-blue-600 font-bold text-xl">3</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Learning</h3>
//               <p className="text-gray-600">
//                 Attend your personalized session, master new skills, and leave a review to help other learners find great tutors.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* For Tutors Section */}
//       <section className="max-w-6xl mx-auto px-4 py-16">
//         <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-12 text-white">
//           <h2 className="text-3xl font-bold mb-6">For Expert Tutors</h2>
//           <p className="text-blue-100 text-lg mb-8 max-w-2xl">
//             Share your knowledge, build your reputation, and earn income on your own schedule. SkillBridge provides the platform, you provide the expertise.
//           </p>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                 <span className="text-white text-xs">✓</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1">Manage Your Schedule</h4>
//                 <p className="text-blue-100 text-sm">Set your availability and teach when it works for you</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                 <span className="text-white text-xs">✓</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1">Build Your Profile</h4>
//                 <p className="text-blue-100 text-sm">Showcase your expertise and earn student reviews</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                 <span className="text-white text-xs">✓</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1">Track Your Sessions</h4>
//                 <p className="text-blue-100 text-sm">View all your bookings and teaching history in one place</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                 <span className="text-white text-xs">✓</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1">Set Your Rates</h4>
//                 <p className="text-blue-100 text-sm">You control your pricing and terms</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Platform Features */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <BookOpen className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Diverse Subjects</h3>
//               <p className="text-gray-600">
//                 From mathematics to music, coding to cooking - find tutors for any subject you want to master.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Users className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
//               <p className="text-gray-600">
//                 Read authentic reviews and ratings from real students to make informed decisions.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Shield className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
//               <p className="text-gray-600">
//                 Our platform is monitored by admins to ensure a safe, quality learning environment for all.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="max-w-6xl mx-auto px-4 py-16">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Learning Journey?</h2>
//           <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
//             Join thousands of students and tutors already using SkillBridge to achieve their educational goals.
//           </p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <a href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
//               Get Started
//             </a>
//             <a href="/findTutor" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
//               Browse Tutors
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }