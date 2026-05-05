// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   CalendarCheck,
//   BookOpen,
//   Clock,
// } from "lucide-react";
// import type { StudentDashboard } from "@/types/student";

// interface Props {
//   data: StudentDashboard;
// }

// export default function StudentDashboardUI({ data }: Props) {
//   const upcoming =
//     data.totalBookings - data.completedBookings;

//   const completionRate =
//     data.totalBookings === 0
//       ? 0
//       : Math.round(
//           (data.completedBookings / data.totalBookings) * 100
//         );

//   return (
//     <div className="container mx-auto space-y-10 px-4 py-10">
//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col gap-2">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Student Dashboard
//         </h1>
//         <p className="text-muted-foreground">
//           Track your sessions and learning progress
//         </p>
//       </div>

//       {/* ================= STATS GRID ================= */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         <StatCard
//           title="Total Bookings"
//           value={data.totalBookings}
//           icon={BookOpen}
//           badge="All time"
//         />

//         <StatCard
//           title="Completed Sessions"
//           value={data.completedBookings}
//           icon={CalendarCheck}
//           badge="Done"
//         />

//         <StatCard
//           title="Upcoming Sessions"
//           value={upcoming}
//           icon={Clock}
//           badge="Pending"
//         />
//       </div>

//       {/* ================= PROGRESS ================= */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base">
//             Learning Progress
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-3">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">
//               Completion rate
//             </span>
//             <span className="font-medium">
//               {completionRate}%
//             </span>
//           </div>

//           <Progress value={completionRate} />

//           <p className="text-xs text-muted-foreground">
//             Based on completed vs total sessions
//           </p>
//         </CardContent>
//       </Card>

//       {/* ================= FUTURE SECTION ================= */}
//       <Card className="border-dashed">
//         <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
//           Recent sessions, tutors, and analytics will appear here.
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// /* ================= SUB COMPONENT ================= */

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon: React.ElementType;
//   badge: string;
// }

// function StatCard({
//   title,
//   value,
//   icon: Icon,
//   badge,
// }: StatCardProps) {
//   return (
//     <Card className="transition hover:shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium">
//           {title}
//         </CardTitle>
//         <Icon className="h-5 w-5 text-muted-foreground" />
//       </CardHeader>

//       <CardContent>
//         <div className="flex items-end justify-between">
//           <div className="text-3xl font-bold">{value}</div>
//           <Badge variant="secondary">{badge}</Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }























"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import {
  CalendarCheck, BookOpen, Clock, TrendingUp, Star,
  ChevronRight, Play, Award, Zap, Target, Bell
} from "lucide-react";
import { FaUserGraduate, FaChalkboardTeacher, FaFire } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Background, GlassCard } from "@/components/layout/Background";
import type { StudentDashboard } from "@/types/student";

// ─── Mock recent sessions (replace with real data) ──────────────
const recentSessions = [
  { id: 1, tutor: "Arif Hossain", subject: "Mathematics", date: "Today, 3:00 PM", status: "upcoming", rating: null },
  { id: 2, tutor: "Nadia Islam", subject: "Physics", date: "Yesterday, 5:00 PM", status: "completed", rating: 5 },
  { id: 3, tutor: "Karim Uddin", subject: "Chemistry", date: "2 days ago", status: "completed", rating: 4 },
];

// ─── Animated counter hook ───────────────────────────────────────
function useCountUp(target: number, duration = 1.4) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Circular progress ring ──────────────────────────────────────
function RingProgress({ value, size = 80 }: { value: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-blue-100 dark:text-blue-900/40" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Stat card ───────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  badge: string;
  color: string;
  delay?: number;
  lottieUrl?: string;
}

function StatCard({ title, value, icon: Icon, badge, color, delay = 0 }: StatCardProps) {
  const count = useCountUp(value);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const onEnter = () => gsap.to(el, { y: -4, scale: 1.02, duration: 0.25, ease: "power2.out" });
    const onLeave = () => gsap.to(el, { y: 0, scale: 1, duration: 0.35, ease: "elastic.out(1,0.6)" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="relative overflow-hidden cursor-pointer group">
        {/* Gradient accent top */}
        <div className={`absolute top-0 inset-x-0 h-[3px] ${color} rounded-t-2xl`} />

        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${color.replace("bg-gradient-to-r", "bg-gradient-to-br")} bg-opacity-10`}>
            <div className="p-2 rounded-lg bg-white/60 dark:bg-zinc-800/60 shadow-sm">
              <Icon className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide uppercase">
            {badge}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-4xl font-black text-foreground tabular-nums">{count}</p>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ background: "radial-gradient(circle at 50% 120%, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      </GlassCard>
    </motion.div>
  );
}

// ─── Session row ─────────────────────────────────────────────────
function SessionRow({ session, index }: { session: typeof recentSessions[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors group cursor-pointer"
    >
      <Avatar className="size-9 border border-blue-100 dark:border-blue-800/40">
        <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          {session.tutor.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{session.tutor}</p>
        <p className="text-xs text-muted-foreground">{session.subject} · {session.date}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {session.status === "completed" ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: session.rating ?? 0 }).map((_, i) => (
              <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        ) : (
          <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">
            Upcoming
          </Badge>
        )}
        <ChevronRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

// ─── Streak/achievement banner ────────────────────────────────────
function StreakBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.12) 100%)" }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-orange-500/20">
              <FaFire className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                7-Day Streak! <HiSparkles className="text-amber-400" />
              </p>
              <p className="text-xs text-muted-foreground">Keep it up — you're on a roll</p>
            </div>
          </div>
          <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow shadow-blue-500/20">
            <Play className="size-3" /> Book Now
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
interface Props { data: StudentDashboard; }

export default function StudentDashboardUI({ data }: Props) {
  const upcoming = data.totalBookings - data.completedBookings;
  const completionRate = data.totalBookings === 0
    ? 0
    : Math.round((data.completedBookings / data.totalBookings) * 100);

  const headerRef = useRef<HTMLDivElement>(null);

  // GSAP header entrance
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current.querySelectorAll(".gsap-header > *"),
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  return (
    <Background
      variant="subtle"
      decorations
      grid
      accent={false}
      animate={false}
      as="div"
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div ref={headerRef} className="gsap-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaUserGraduate className="text-blue-500 size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">Student Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              My Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your sessions and learning journey
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-xl border-blue-100 dark:border-blue-800/40 relative">
              <Bell className="size-4 text-blue-600" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
            </Button>
            <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5">
              <FaChalkboardTeacher className="size-3.5" /> Find Tutor
            </Button>
          </div>
        </div>

        {/* ── STREAK BANNER ──────────────────────────────────── */}
        <StreakBanner />

        {/* ── STATS GRID ─────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Bookings" value={data.totalBookings} icon={BookOpen}
            badge="All time" color="bg-gradient-to-r from-blue-500 to-cyan-500" delay={0.15} />
          <StatCard title="Completed Sessions" value={data.completedBookings} icon={CalendarCheck}
            badge="Done" color="bg-gradient-to-r from-emerald-500 to-teal-500" delay={0.25} />
          <StatCard title="Upcoming Sessions" value={upcoming} icon={Clock}
            badge="Pending" color="bg-gradient-to-r from-violet-500 to-indigo-500" delay={0.35} />
        </div>

        {/* ── PROGRESS + SESSIONS ROW ─────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-5">

          {/* Progress panel — 2 cols */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="h-full space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Progress</p>
                <h2 className="text-lg font-bold text-foreground">Learning Journey</h2>
              </div>

              {/* Ring + number */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <RingProgress value={completionRate} size={88} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-foreground">{completionRate}%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-muted-foreground">{data.completedBookings} completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-200 dark:bg-blue-800" />
                    <span className="text-xs text-muted-foreground">{upcoming} remaining</span>
                  </div>
                </div>
              </div>

              <Separator className="opacity-40" />

              {/* Mini achievements */}
              <div className="space-y-2.5">
                {[
                  { label: "Attendance", val: 92, icon: Target, color: "from-blue-500 to-cyan-400" },
                  { label: "Avg Rating", val: 88, icon: Star, color: "from-amber-400 to-orange-400" },
                  { label: "Engagement", val: 75, icon: Zap, color: "from-violet-500 to-indigo-400" },
                ].map(({ label, val, icon: Ic, color }, i) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                        <Ic className="size-3" /> {label}
                      </span>
                      <span className="font-bold text-foreground">{val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent sessions — 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">History</p>
                  <h2 className="text-lg font-bold text-foreground">Recent Sessions</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl gap-1">
                  View all <ChevronRight className="size-3.5" />
                </Button>
              </div>

              <div className="space-y-1">
                {recentSessions.map((s, i) => (
                  <SessionRow key={s.id} session={s} index={i} />
                ))}
              </div>

              <Separator className="my-4 opacity-40" />

              {/* Quick stats footer */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "This week", val: "3 sessions", icon: TrendingUp },
                  { label: "Top subject", val: "Math", icon: Award },
                  { label: "Streak", val: "7 days", icon: FaFire },
                ].map(({ label, val, icon: Ic }) => (
                  <div key={label} className="text-center p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-900/20">
                    <Ic className="size-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-foreground">{val}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ── PLACEHOLDER / FUTURE SECTION ───────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <GlassCard className="border-dashed">
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <HiSparkles className="size-8 text-blue-300 dark:text-blue-700" />
              <p className="text-sm font-semibold text-muted-foreground">
                Personalized recommendations & analytics coming soon
              </p>
              <p className="text-xs text-muted-foreground/60">
                We're building something awesome for you
              </p>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </Background>
  );
}