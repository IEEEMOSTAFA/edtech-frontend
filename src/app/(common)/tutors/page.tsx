"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RiSearchLine,
  RiFilterLine,
  RiStarFill,
  RiStarLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiShieldStarLine,
  RiArrowRightLine,
  RiUserLine,
  RiFireLine,
  RiBarChartBoxLine,
  RiCheckboxCircleLine,
  RiTeamLine,
  RiCloseLine,
  RiSortDesc,
  RiBookOpenLine,
  RiSparklingLine,
  RiArrowUpLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Background, { GlassCard } from "@/components/layout/Background";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───────────────────────────────────────────────────────
type Tutor = {
  id: string;
  userId: string;
  hourlyRate: number;
  experience: number;
  bio?: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  user: { id: string; name: string; email: string; image?: string };
  categories?: Array<{ id: string; name: string; icon?: string }>;
};

// ─── Animation Variants ──────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Animated Counter (GSAP) ──────────────────────────────────────
function AnimatedCount({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    gsap.to({ val: 0 }, {
      val: target,
      duration: 1.8,
      ease: "power3.out",
      onUpdate: function () { setCount(Math.round(this.targets()[0].val)); },
    });
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── Star Rating ─────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i =>
        i <= Math.round(rating)
          ? <RiStarFill key={i} className="w-3.5 h-3.5 text-amber-400" />
          : <RiStarLine key={i} className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
      )}
    </div>
  );
}

// ─── Particle Canvas ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.45 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.a})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />;
}

// ─── Tutor Card ───────────────────────────────────────────────────
function TutorCard({ tutor, featured = false }: { tutor: Tutor; featured?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    gsap.to(el, { rotateX: y, rotateY: x, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
  };
  const handleMouseLeave = () =>
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.6)" });

  const initials = tutor.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      variants={cardVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      className="group h-full"
    >
      <Card className={cn(
        "relative overflow-hidden border h-full flex flex-col transition-all duration-300",
        "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl",
        "hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1.5",
        featured
          ? "border-amber-400/60 shadow-lg shadow-amber-500/10"
          : "border-white/40 dark:border-zinc-700/40 shadow-md"
      )}>
        {/* Featured ribbon */}
        {featured && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-4 py-1 flex items-center gap-1 rounded-bl-xl shadow-lg tracking-wide">
              <RiShieldStarLine className="w-3 h-3" /> FEATURED
            </div>
          </div>
        )}

        {/* Banner */}
        <div className={cn(
          "h-24 w-full relative flex-shrink-0",
          featured
            ? "bg-gradient-to-br from-amber-400 via-orange-500 to-violet-600"
            : "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600"
        )}>
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`g-${tutor.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#g-${tutor.id})`} />
          </svg>
          {/* Hover shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)" }} />
        </div>

        <CardHeader className="pt-0 pb-3 px-5">
          <div className="-mt-10 flex justify-center mb-3">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white dark:border-zinc-900 shadow-xl ring-2 ring-violet-400/30">
                <AvatarImage src={tutor.user.image} alt={tutor.user.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {featured && (
                <span className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1 shadow-md">
                  <RiCheckboxCircleLine className="w-3.5 h-3.5 text-white" />
                </span>
              )}
            </div>
          </div>

          <div className="text-center space-y-1.5">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {tutor.user.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={tutor.rating} />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{tutor.rating.toFixed(1)}</span>
              <span className="text-xs text-zinc-400">
                ({tutor.totalReviews} {tutor.totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          {tutor.categories && tutor.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {tutor.categories.slice(0, 3).map(cat => (
                <Badge key={cat.id} variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0 font-medium">
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </Badge>
              ))}
              {tutor.categories.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-zinc-500">
                  +{tutor.categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="px-5 pb-4 flex-1">
          {tutor.bio && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center line-clamp-2 mb-4 leading-relaxed">
              {tutor.bio}
            </p>
          )}
          <Separator className="mb-4 opacity-40" />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-700/40">
              <RiTimeLine className="w-4 h-4 text-violet-500" />
              <span className="text-[10px] text-zinc-500 font-medium">Experience</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {tutor.experience} {tutor.experience === 1 ? "yr" : "yrs"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-700/40">
              <RiMoneyDollarCircleLine className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-zinc-500 font-medium">Hourly Rate</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${tutor.hourlyRate}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5">
          <Button asChild className={cn(
            "w-full font-semibold text-sm rounded-xl shadow-md group/btn transition-all duration-200",
            featured
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          )}>
            <Link href={`/tutors/${tutor.userId}`} className="flex items-center justify-center gap-2">
              View Profile
              <RiArrowRightLine className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────
function TutorCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-white/30 dark:border-zinc-700/30 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
      <Skeleton className="h-24 w-full" />
      <CardHeader className="pt-0 pb-3 px-5">
        <div className="-mt-10 flex justify-center mb-3"><Skeleton className="w-20 h-20 rounded-full" /></div>
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" /><Skeleton className="h-16 rounded-xl" />
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5"><Skeleton className="h-10 w-full rounded-xl" /></CardFooter>
    </Card>
  );
}

// ─── Section Header ───────────────────────────────────────────────
function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-200/40 dark:border-violet-700/30">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h2>
        {count !== undefined && <p className="text-xs text-zinc-400 mt-0.5">{count} tutor{count !== 1 ? "s" : ""}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-violet-200/60 to-transparent dark:from-violet-700/30 ml-2" />
    </motion.div>
  );
}

// ─── Scroll-to-top ────────────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
        >
          <RiArrowUpLine className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function TutorsPage() {
  const [tutors, setTutors]     = useState<Tutor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort]         = useState("recommended");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 400], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 280], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<{ data: Tutor[] }>("/tutors");
        setTutors(res?.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // GSAP scroll-triggered section reveals
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } }
        );
      });
    });
    return () => ctx.revert();
  }, [loading]);

  const filtered = tutors
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || t.user.name.toLowerCase().includes(q)
        || t.bio?.toLowerCase().includes(q)
        || t.categories?.some(c => c.name.toLowerCase().includes(q));
      const matchCat = category === "all"
        || t.categories?.some(c => c.name.toLowerCase() === category.toLowerCase());
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "rating")      return b.rating - a.rating;
      if (sort === "reviews")     return b.totalReviews - a.totalReviews;
      if (sort === "price-low")   return a.hourlyRate - b.hourlyRate;
      if (sort === "price-high")  return b.hourlyRate - a.hourlyRate;
      if (sort === "experience")  return b.experience - a.experience;
      return Number(b.isFeatured) - Number(a.isFeatured);
    });

  const featuredTutors = filtered.filter(t => t.isFeatured);
  const regularTutors  = filtered.filter(t => !t.isFeatured);
  const avgRating = tutors.length > 0
    ? Math.round((tutors.reduce((a, t) => a + t.rating, 0) / tutors.length) * 10) / 10
    : 0;
  const minPrice = tutors.length > 0 ? Math.min(...tutors.map(t => t.hourlyRate)) : 0;

  const statsData = [
    { icon: <RiTeamLine className="w-5 h-5 text-violet-500" />,            label: "Expert Tutors",  value: tutors.length,                                       suffix: "+",  color: "violet"  },
    { icon: <RiBarChartBoxLine className="w-5 h-5 text-indigo-500" />,     label: "Total Reviews",  value: tutors.reduce((a, t) => a + t.totalReviews, 0),      suffix: "",   color: "indigo"  },
    { icon: <RiStarFill className="w-5 h-5 text-amber-500" />,             label: "Avg Rating",     value: Math.round(avgRating * 10),                          suffix: "★",  color: "amber"   },
    { icon: <RiMoneyDollarCircleLine className="w-5 h-5 text-emerald-500" />, label: "From $/hr",   value: minPrice,                                            prefix: "$",  suffix: "",  color: "emerald" },
  ];

  const allCategories = Array.from(new Set(
    tutors.flatMap(t => t.categories?.map(c => c.name) ?? [])
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden">
        <Background
          as="div"
          variant="deep"
          decorations
          grid
          accent
          animate={false}
          className="relative min-h-[540px] flex items-center"
        >
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <ParticleCanvas />
          </motion.div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-28 text-center">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-6 px-4 py-1.5 text-xs font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700/60 rounded-full gap-1.5 shadow-sm">
                <RiSparklingLine className="w-3.5 h-3.5" />
                {loading ? "Loading tutors…" : `${tutors.length}+ Verified Tutors Available`}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4 leading-[1.06]"
            >
              Find Your{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Perfect Tutor
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Connect with expert tutors and start learning today
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.26 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative flex items-center gap-2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-violet-500/10 border border-white/60 dark:border-zinc-700/60 px-4 py-2">
                <RiSearchLine className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='Try "Mathematics", "Python", "English"…'
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 text-sm font-medium flex-1 h-10"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                )}
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 shadow-md">
                  Search
                </Button>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                🎯 Over {tutors.length} subjects covered across all academic levels
              </p>
            </motion.div>
          </div>
        </Background>
      </div>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statsData.map((stat, i) => (
            <motion.div key={i} variants={cardVariants}>
              <GlassCard
                className="text-center h-full !py-6 !px-4"
                decorations={false}
                accent={false}
                variant="subtle"
                animate={false}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2.5 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/30`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-extrabold text-${stat.color}-600 dark:text-${stat.color}-400 tracking-tight`}>
                    {!loading
                      ? <AnimatedCount target={stat.value} prefix={(stat as any).prefix} suffix={stat.suffix} />
                      : <Skeleton className="h-8 w-16 mx-auto" />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <div className="gsap-reveal">
          <GlassCard variant="subtle" animate={false} decorations={false} accent={false} className="!py-4 !px-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <RiFilterLine className="w-4 h-4" /> Filter by:
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-44 h-9 text-sm bg-white/60 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/60 rounded-xl">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map(c => (
                      <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <RiSortDesc className="w-4 h-4" /> Sort:
                </div>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-48 h-9 text-sm bg-white/60 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/60 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">Price: Low → High</SelectItem>
                    <SelectItem value="price-high">Price: High → Low</SelectItem>
                    <SelectItem value="experience">Most Experience</SelectItem>
                  </SelectContent>
                </Select>

                {(search || category !== "all" || sort !== "recommended") && (
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => { setSearch(""); setCategory("all"); setSort("recommended"); }}
                    className="h-9 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-xl gap-1"
                  >
                    <RiCloseLine className="w-3.5 h-3.5" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Featured Tutors */}
        <AnimatePresence mode="wait">
          {!loading && featuredTutors.length > 0 && (
            <motion.div
              key="featured"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={containerVariants}
              className="gsap-reveal"
            >
              <SectionHeader
                icon={<RiFireLine className="w-5 h-5 text-amber-500" />}
                title="Featured Tutors"
                count={featuredTutors.length}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTutors.map(tutor => (
                  <TutorCard key={tutor.userId} tutor={tutor} featured />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Tutors */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
          className="gsap-reveal"
        >
          <SectionHeader
            icon={<RiBookOpenLine className="w-5 h-5 text-violet-500" />}
            title={featuredTutors.length > 0 ? "All Tutors" : "Browse Tutors"}
            count={regularTutors.length}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <TutorCardSkeleton key={i} />)}
            </div>
          ) : regularTutors.length === 0 && featuredTutors.length === 0 ? (
            <motion.div variants={fadeUp}>
              <GlassCard variant="subtle" animate={false} decorations={false} accent={false} className="text-center !py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60">
                    <RiUserLine className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No tutors found</h3>
                    <p className="text-sm text-zinc-400">
                      {search || category !== "all"
                        ? "Try adjusting your filters or search terms"
                        : "Check back later for available tutors"}
                    </p>
                  </div>
                  {(search || category !== "all") && (
                    <Button variant="outline" size="sm"
                      onClick={() => { setSearch(""); setCategory("all"); }}
                      className="rounded-xl gap-1.5 text-xs">
                      <RiCloseLine className="w-3.5 h-3.5" /> Clear filters
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularTutors.map(tutor => (
                <TutorCard key={tutor.userId} tutor={tutor} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Results summary */}
        {!loading && filtered.length > 0 && (
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center text-xs text-zinc-400 dark:text-zinc-600 pb-4"
          >
            Showing {filtered.length} of {tutors.length} tutors
            {search && <> matching <span className="font-semibold text-violet-500">"{search}"</span></>}
          </motion.p>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}


















// import { apiFetch } from "@/lib/api";
// import Link from "next/link";
// import {
//   Search,
//   DollarSign,
//   Award,
//   Star,
//   Clock,
//   Filter,
//   TrendingUp,
//   User,
//   ChevronRight
// } from "lucide-react";

// type Tutor = {
//   id: string;
//   userId: string;
//   hourlyRate: number;
//   experience: number;
//   bio?: string;
//   rating: number;
//   totalReviews: number;
//   isFeatured: boolean;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//   };
//   categories?: Array<{
//     id: string;
//     name: string;
//     icon?: string;
//   }>;
// };

// export default async function TutorsPage() {
//   const res = await apiFetch<{ data: Tutor[] }>("/tutors");
//   const tutors = res?.data || [];

//   // Separate featured and regular tutors
//   const featuredTutors = tutors.filter(t => t.isFeatured);
//   const regularTutors = tutors.filter(t => !t.isFeatured);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Find Your Perfect Tutor
//             </h1>
//             <p className="text-xl text-blue-100 mb-8">
//               Connect with expert tutors and start learning today
//             </p>

//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by subject, tutor name, or expertise..."
//                   className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
//                 />
//               </div>
//               <p className="text-blue-100 text-sm mt-3">
//                 {`🔍 Try searching: "Math", "Physics", "English", "Programming"`}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

//         {/* Stats Bar */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
//           <div className="bg-white rounded-xl p-6 shadow-md text-center">
//             <div className="text-3xl font-bold text-blue-600">{tutors.length}</div>
//             <div className="text-gray-600 text-sm mt-1">Expert Tutors</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-md text-center">
//             <div className="text-3xl font-bold text-green-600">
//               {tutors.reduce((acc, t) => acc + t.totalReviews, 0)}
//             </div>
//             <div className="text-gray-600 text-sm mt-1">Total Reviews</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-md text-center">
//             <div className="text-3xl font-bold text-purple-600">
//               {Math.round(tutors.reduce((acc, t) => acc + t.rating, 0) / tutors.length * 10) / 10 || 0}★
//             </div>
//             <div className="text-gray-600 text-sm mt-1">Average Rating</div>
//           </div>
//           <div className="bg-white rounded-xl p-6 shadow-md text-center">
//             <div className="text-3xl font-bold text-orange-600">
//               ${Math.min(...tutors.map(t => t.hourlyRate))}+
//             </div>
//             <div className="text-gray-600 text-sm mt-1">Starting Price/hr</div>
//           </div>
//         </div>

//         {/* Filters & Sort (Placeholder) */}
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200">
//               <Filter className="w-4 h-4 text-gray-600" />
//               <span className="text-gray-700 font-medium">Filters</span>
//             </button>
//             <select className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300">
//               <option>All Categories</option>
//               <option>Mathematics</option>
//               <option>Science</option>
//               <option>Languages</option>
//               <option>Programming</option>
//             </select>
//           </div>

//           <select className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300">
//             <option>Sort by: Recommended</option>
//             <option>Highest Rated</option>
//             <option>Most Reviews</option>
//             <option>Lowest Price</option>
//             <option>Highest Price</option>
//             <option>Most Experience</option>
//           </select>
//         </div>

//         {/* Featured Tutors Section */}
//         {featuredTutors.length > 0 && (
//           <div className="mb-12">
//             <div className="flex items-center gap-2 mb-6">
//               <TrendingUp className="w-6 h-6 text-yellow-500" />
//               <h2 className="text-2xl font-bold text-gray-900">Featured Tutors</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {featuredTutors.map((tutor) => (
//                 <TutorCard key={tutor.userId} tutor={tutor} featured />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* All Tutors Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             {featuredTutors.length > 0 ? 'All Tutors' : 'Browse Tutors'}
//           </h2>

//           {regularTutors.length === 0 && featuredTutors.length === 0 ? (
//             <div className="text-center py-20 bg-white rounded-2xl shadow-md">
//               <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No tutors found</h3>
//               <p className="text-gray-500">Check back later for available tutors</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {regularTutors.map((tutor) => (
//                 <TutorCard key={tutor.userId} tutor={tutor} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Tutor Card Component
// function TutorCard({ tutor, featured = false }: { tutor: Tutor; featured?: boolean }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${featured ? 'ring-2 ring-yellow-400' : ''
//       }`}>

//       {/* Card Header */}
//       <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 pb-20">
//         {featured && (
//           <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
//             <Award className="w-3 h-3" />
//             FEATURED
//           </div>
//         )}

//         {/* Profile Image */}
//         <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
//           {tutor.user.image ? (
//             <img
//               src={tutor.user.image}
//               alt={tutor.user.name}
//               className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center">
//               <User className="w-12 h-12 text-gray-400" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Card Body */}
//       <div className="pt-16 px-6 pb-6">

//         {/* Name & Rating */}
//         <div className="text-center mb-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">
//             {tutor.user.name}
//           </h3>

//           <div className="flex items-center justify-center gap-2">
//             <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
//               <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//               <span className="text-sm font-semibold text-gray-700">
//                 {tutor.rating.toFixed(1)}
//               </span>
//             </div>
//             <span className="text-gray-500 text-sm">
//               ({tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'})
//             </span>
//           </div>
//         </div>

//         {/* Categories */}
//         {tutor.categories && tutor.categories.length > 0 && (
//           <div className="flex flex-wrap gap-2 justify-center mb-4">
//             {tutor.categories.slice(0, 3).map((category) => (
//               <span
//                 key={category.id}
//                 className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
//               >
//                 {category.name}
//               </span>
//             ))}
//             {tutor.categories.length > 3 && (
//               <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
//                 +{tutor.categories.length - 3} more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Bio Preview */}
//         {tutor.bio && (
//           <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
//             {tutor.bio}
//           </p>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-gray-50 rounded-lg p-3 text-center">
//             <div className="flex items-center justify-center gap-1 text-gray-700 mb-1">
//               <Clock className="w-4 h-4" />
//               <span className="text-xs font-medium">Experience</span>
//             </div>
//             <div className="text-lg font-bold text-gray-900">
//               {tutor.experience} {tutor.experience === 1 ? 'year' : 'years'}
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-3 text-center">
//             <div className="flex items-center justify-center gap-1 text-gray-700 mb-1">
//               <DollarSign className="w-4 h-4" />
//               <span className="text-xs font-medium">Hourly Rate</span>
//             </div>
//             <div className="text-lg font-bold text-gray-900">
//               ${tutor.hourlyRate}
//             </div>
//           </div>
//         </div>

//         {/* View Profile Button */}
//         <Link
//           href={`/tutors/${tutor.userId}`}
//           className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group"
//         >
//           <span className="flex items-center justify-center gap-2">
//             View Profile
//             <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//           </span>
//         </Link>
//       </div>
//     </div>
//   );
// }


