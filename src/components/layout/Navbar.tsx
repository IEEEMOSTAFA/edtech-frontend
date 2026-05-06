"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { Menu, X, LogOut, GraduationCap, BookOpen, Shield, Sun, Moon, Home } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { adminRoutes } from "@/routes/adminRoutes";
import { tutorRoutes } from "@/routes/tutorRoutes";
import { studentRoutes } from "@/routes/studentRoutes";

// ── Types ──────────────────────────────────────────────────────────
type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
interface User { id: string; name: string; role: UserRole; }
interface MenuItem { title: string; url: string; icon?: React.ReactNode; }

// ── Public nav links ───────────────────────────────────────────────
const publicMenu: MenuItem[] = [
  { title: "Home", url: "/", icon: <Home className="size-4" /> },
  { title: "Find Tutors", url: "/tutors", icon: <GraduationCap className="size-4" /> },
  { title: "About", url: "/about", icon: <BookOpen className="size-4" /> },
];

// ── Role metadata ──────────────────────────────────────────────────
const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; cls: string }> = {
  STUDENT: {
    label: "Student",
    icon: <GraduationCap className="size-3" />,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  TUTOR: {
    label: "Tutor",
    icon: <BookOpen className="size-3" />,
    cls: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  ADMIN: {
    label: "Admin",
    icon: <Shield className="size-3" />,
    cls: "bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  },
};

// ── Framer Motion variants ─────────────────────────────────────────
const mobileItemVariant: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.055, duration: 0.22, ease: "easeOut" as const },
  }),
};

// ══════════════════════════════════════════════════════════════════
export function Navbar({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setTheme } = useTheme();

  const logoRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ── GSAP: logo entrance ────────────────────────────────────────
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -22, rotate: -12 },
      { opacity: 1, x: 0, rotate: 0, duration: 0.7, ease: "back.out(1.6)", delay: 0.1 }
    );
  }, []);

  // ── GSAP: nav links stagger on mount ───────────────────────────
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current.querySelectorAll(".nav-link"),
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  // ── Fetch current user ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/get-session", { credentials: "include" });
        if (!res.ok) return setUser(null);
        const json = await res.json();
        setUser(json?.user ?? null);
      } catch { setUser(null); }
    })();
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login");
  };

  // ── Role-based menu ────────────────────────────────────────────
  const roleMenu: MenuItem[] =
    !user ? [] :
      user.role === "ADMIN" ? adminRoutes :
        user.role === "TUTOR" ? tutorRoutes :
          studentRoutes;

  const allLinks = [...publicMenu, ...roleMenu];

  // ── Logo GSAP hover ────────────────────────────────────────────
  const onLogoEnter = () =>
    gsap.to(logoRef.current, { rotate: 8, scale: 1.1, duration: 0.22, ease: "power2.out" });
  const onLogoLeave = () =>
    gsap.to(logoRef.current, { rotate: 0, scale: 1, duration: 0.35, ease: "elastic.out(1,0.55)" });

  // ══════════════════════════════════════════════════════════════
  return (
    /* Floating pill container — sits 16px from top, full width with padding */
    <div className={cn("fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-10", className)}>
      <motion.header
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto max-w-6xl",
          /* Glass pill */
          "rounded-2xl",
          "border border-blue-200/40 dark:border-blue-800/30",
          "bg-white/60 dark:bg-zinc-950/60",
          "backdrop-blur-2xl",
          "shadow-[0_8px_32px_rgba(59,130,246,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
          /* Layout */
          "px-4 sm:px-5 h-14 flex items-center justify-between gap-4"
        )}
      >

        {/* ── LOGO ──────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            ref={logoRef}
            src="/images/SyntaxSpace.png"
            alt="SyntaxSpace"
            className="h-10 w-10 object-cover rounded-full border border-gray-200 shadow-sm"
            onMouseEnter={onLogoEnter}
            onMouseLeave={onLogoLeave}
          />
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="font-bold text-[15px] tracking-tight hidden sm:block select-none"
          >
            <span className="text-blue-600 dark:text-blue-400">Syntax</span>
            <span className="text-blue-900 dark:text-blue-100">Space</span>
          </motion.span>
        </Link>

        {/* ── DESKTOP NAV ───────────────────────────────────────── */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {allLinks.map((item) => (
            <motion.div key={item.title} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href={item.url}
                className={cn(
                  "nav-link flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium",
                  "text-blue-900/65 dark:text-blue-200/65",
                  "hover:text-blue-700 dark:hover:text-blue-300",
                  "hover:bg-blue-100/60 dark:hover:bg-blue-900/30",
                  "transition-all duration-150"
                )}
              >
                <span className="text-blue-400 dark:text-blue-500">{item.icon}</span>
                {item.title}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* ── RIGHT ACTIONS ─────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Dark / Light toggle — two direct buttons */}
          <div className="hidden lg:flex items-center gap-0.5">
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => setTheme("light")}
              title="Light mode"
              className="p-2 rounded-xl text-blue-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
            >
              <Sun className="size-[15px]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => setTheme("dark")}
              title="Dark mode"
              className="p-2 rounded-xl text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Moon className="size-[15px]" />
            </motion.button>
          </div>

          {/* ── AUTH STATE ──────────────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* Guest */}
            {!user && (
              <motion.div
                key="guest"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                className="hidden lg:flex items-center gap-2 ml-0.5"
              >
                <Button
                  asChild variant="ghost" size="sm"
                  className="rounded-xl font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow shadow-blue-500/25 transition-all"
                >
                  <Link href="/signup">Signup</Link>
                </Button>
              </motion.div>
            )}

            {/* Logged in — name pill + logout icon */}
            {user && (
              <motion.div
                key="loggedin"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                className="hidden lg:flex items-center gap-2 ml-0.5"
              >
                {/* Name + role badge pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-800/40">
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <Badge
                    className={cn(
                      "gap-1 text-[10px] font-bold px-1.5 py-0 h-4 border-0 rounded-md",
                      roleMeta[user.role].cls
                    )}
                  >
                    {roleMeta[user.role].icon}
                    {roleMeta[user.role].label}
                  </Badge>
                </div>

                {/* Logout — icon only */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="icon" variant="ghost"
                    onClick={handleLogout}
                    title="Logout"
                    className="rounded-xl size-9 text-blue-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── MOBILE HAMBURGER ──────────────────────────────────── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost" size="icon"
                suppressHydrationWarning
                className="lg:hidden rounded-xl size-9 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X className="size-5" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu className="size-5" /></motion.div>
                  }
                </AnimatePresence>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 p-0 flex flex-col bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-blue-100/60 dark:border-blue-900/30"
            >
              {/* Header */}
              <SheetHeader className="px-5 pt-5 pb-4 border-b border-blue-100/60 dark:border-blue-900/30">
                <SheetTitle className="flex items-center gap-2">
                  <img src="/SyntaxSpace.png" alt="SyntaxSpace" className="h-7 w-auto" />
                  <span className="font-bold text-[15px]">
                    <span className="text-blue-600 dark:text-blue-400">Syntax</span>
                    <span className="text-blue-900 dark:text-blue-100">Space</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* User info card */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="mx-4 mt-4 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-800/40"
                >
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">{user.name}</p>
                  <Badge className={cn("mt-1 gap-1 text-[10px] font-bold px-1.5 py-0 h-4 border-0 rounded-md", roleMeta[user.role].cls)}>
                    {roleMeta[user.role].icon}
                    {roleMeta[user.role].label}
                  </Badge>
                </motion.div>
              )}

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
                {allLinks.map((item, i) => (
                  <motion.div key={item.title} custom={i} variants={mobileItemVariant} initial="hidden" animate="visible">
                    <Link
                      href={item.url}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-900/65 dark:text-blue-200/65 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <span className="text-blue-400 dark:text-blue-500">{item.icon}</span>
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="px-4 pb-6 pt-3 border-t border-blue-100/60 dark:border-blue-900/30 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setTheme("light")}
                      title="Light mode"
                      className="p-2 rounded-xl text-blue-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
                    >
                      <Sun className="size-[15px]" />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      title="Dark mode"
                      className="p-2 rounded-xl text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Moon className="size-[15px]" />
                    </button>
                  </div>
                </div>

                {!user ? (
                  <>
                    <Button
                      asChild variant="outline"
                      className="w-full rounded-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow shadow-blue-500/20"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signup">Signup</Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/25 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-100 dark:border-red-900/30"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </motion.header>
    </div>
  );
}

















// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { gsap } from "gsap";
// import { Menu, X, LogOut, GraduationCap, BookOpen, Shield, Sun, Moon, Home } from "lucide-react";
// import { useTheme } from "next-themes";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import { adminRoutes } from "@/routes/adminRoutes";
// import { tutorRoutes } from "@/routes/tutorRoutes";
// import { studentRoutes } from "@/routes/studentRoutes";

// // ── Types ──────────────────────────────────────────────────────────
// type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
// interface User { id: string; name: string; role: UserRole; }
// interface MenuItem { title: string; url: string; icon?: React.ReactNode; }

// // ── Public nav links ───────────────────────────────────────────────
// const publicMenu: MenuItem[] = [
//   { title: "Home", url: "/", icon: <Home className="size-4" /> },
//   { title: "Find Tutors", url: "/tutors", icon: <GraduationCap className="size-4" /> },
//   { title: "About", url: "/about", icon: <BookOpen className="size-4" /> },
// ];

// // ── Role metadata ──────────────────────────────────────────────────
// const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; cls: string }> = {
//   STUDENT: {
//     label: "Student",
//     icon: <GraduationCap className="size-3" />,
//     cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
//   },
//   TUTOR: {
//     label: "Tutor",
//     icon: <BookOpen className="size-3" />,
//     cls: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
//   },
//   ADMIN: {
//     label: "Admin",
//     icon: <Shield className="size-3" />,
//     cls: "bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
//   },
// };

// // ── Framer Motion variants ─────────────────────────────────────────
// const mobileItemVariant = {
//   hidden: { opacity: 0, x: -14 },
//   visible: (i: number) => ({
//     opacity: 1,
//     x: 0,
//     transition: { delay: i * 0.055, duration: 0.22, ease: "easeOut" },
//   }),
// };

// // ══════════════════════════════════════════════════════════════════
// export function Navbar({ className }: { className?: string }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { setTheme } = useTheme();

//   const logoRef = useRef<HTMLImageElement>(null);
//   const navRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // ── GSAP: logo entrance ────────────────────────────────────────
//   useEffect(() => {
//     if (!logoRef.current) return;
//     gsap.fromTo(
//       logoRef.current,
//       { opacity: 0, x: -22, rotate: -12 },
//       { opacity: 1, x: 0, rotate: 0, duration: 0.7, ease: "back.out(1.6)", delay: 0.1 }
//     );
//   }, []);

//   // ── GSAP: nav links stagger on mount ───────────────────────────
//   useEffect(() => {
//     if (!navRef.current) return;
//     gsap.fromTo(
//       navRef.current.querySelectorAll(".nav-link"),
//       { opacity: 0, y: -10 },
//       { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.3 }
//     );
//   }, []);

//   // ── Fetch current user ─────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/auth/get-session", { credentials: "include" });
//         if (!res.ok) return setUser(null);
//         const json = await res.json();
//         setUser(json?.user ?? null);
//       } catch { setUser(null); }
//     })();
//   }, []);

//   // ── Logout ─────────────────────────────────────────────────────
//   const handleLogout = async () => {
//     await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
//     setUser(null);
//     router.push("/login");
//   };

//   // ── Role-based menu ────────────────────────────────────────────
//   const roleMenu: MenuItem[] =
//     !user ? [] :
//       user.role === "ADMIN" ? adminRoutes :
//         user.role === "TUTOR" ? tutorRoutes :
//           studentRoutes;

//   const allLinks = [...publicMenu, ...roleMenu];

//   // ── Logo GSAP hover ────────────────────────────────────────────
//   const onLogoEnter = () =>
//     gsap.to(logoRef.current, { rotate: 8, scale: 1.1, duration: 0.22, ease: "power2.out" });
//   const onLogoLeave = () =>
//     gsap.to(logoRef.current, { rotate: 0, scale: 1, duration: 0.35, ease: "elastic.out(1,0.55)" });

//   // ══════════════════════════════════════════════════════════════
//   return (
//     /* Floating pill container — sits 16px from top, full width with padding */
//     <div className={cn("fixed top-4 inset-x-0 z-50 px-4 sm:px-6 lg:px-10", className)}>
//       <motion.header
//         initial={{ opacity: 0, y: -24, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//         className={cn(
//           "mx-auto max-w-6xl",
//           /* Glass pill */
//           "rounded-2xl",
//           "border border-blue-200/40 dark:border-blue-800/30",
//           "bg-white/60 dark:bg-zinc-950/60",
//           "backdrop-blur-2xl",
//           "shadow-[0_8px_32px_rgba(59,130,246,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
//           /* Layout */
//           "px-4 sm:px-5 h-14 flex items-center justify-between gap-4"
//         )}
//       >

//         {/* ── LOGO ──────────────────────────────────────────────── */}
//         <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
//           <img
//             ref={logoRef}
//             src="/images/SyntaxSpace.png"
//             alt="SyntaxSpace"
//             className="h-10 w-10 object-cover rounded-full border border-gray-200 shadow-sm"
//             onMouseEnter={onLogoEnter}
//             onMouseLeave={onLogoLeave}
//           />
//           <motion.span
//             initial={{ opacity: 0, x: -6 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.35, duration: 0.4 }}
//             className="font-bold text-[15px] tracking-tight hidden sm:block select-none"
//           >
//             <span className="text-blue-600 dark:text-blue-400">Syntax</span>
//             <span className="text-blue-900 dark:text-blue-100">Space</span>
//           </motion.span>
//         </Link>

//         {/* ── DESKTOP NAV ───────────────────────────────────────── */}
//         <nav ref={navRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
//           {allLinks.map((item) => (
//             <motion.div key={item.title} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
//               <Link
//                 href={item.url}
//                 className={cn(
//                   "nav-link flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium",
//                   "text-blue-900/65 dark:text-blue-200/65",
//                   "hover:text-blue-700 dark:hover:text-blue-300",
//                   "hover:bg-blue-100/60 dark:hover:bg-blue-900/30",
//                   "transition-all duration-150"
//                 )}
//               >
//                 <span className="text-blue-400 dark:text-blue-500">{item.icon}</span>
//                 {item.title}
//               </Link>
//             </motion.div>
//           ))}
//         </nav>

//         {/* ── RIGHT ACTIONS ─────────────────────────────────────── */}
//         <div className="flex items-center gap-1.5 shrink-0">

//           {/* Dark / Light toggle — two direct buttons */}
//           <div className="hidden lg:flex items-center gap-0.5">
//             <motion.button
//               whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
//               onClick={() => setTheme("light")}
//               title="Light mode"
//               className="p-2 rounded-xl text-blue-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
//             >
//               <Sun className="size-[15px]" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
//               onClick={() => setTheme("dark")}
//               title="Dark mode"
//               className="p-2 rounded-xl text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
//             >
//               <Moon className="size-[15px]" />
//             </motion.button>
//           </div>

//           {/* ── AUTH STATE ──────────────────────────────────────── */}
//           <AnimatePresence mode="wait">

//             {/* Guest */}
//             {!user && (
//               <motion.div
//                 key="guest"
//                 initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
//                 className="hidden lg:flex items-center gap-2 ml-0.5"
//               >
//                 <Button
//                   asChild variant="ghost" size="sm"
//                   className="rounded-xl font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
//                 >
//                   <Link href="/login">Login</Link>
//                 </Button>
//                 <Button
//                   asChild size="sm"
//                   className="rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow shadow-blue-500/25 transition-all"
//                 >
//                   <Link href="/signup">Signup</Link>
//                 </Button>
//               </motion.div>
//             )}

//             {/* Logged in — name pill + logout icon */}
//             {user && (
//               <motion.div
//                 key="loggedin"
//                 initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
//                 className="hidden lg:flex items-center gap-2 ml-0.5"
//               >
//                 {/* Name + role badge pill */}
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-800/40">
//                   <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 max-w-[110px] truncate">
//                     {user.name}
//                   </span>
//                   <Badge
//                     className={cn(
//                       "gap-1 text-[10px] font-bold px-1.5 py-0 h-4 border-0 rounded-md",
//                       roleMeta[user.role].cls
//                     )}
//                   >
//                     {roleMeta[user.role].icon}
//                     {roleMeta[user.role].label}
//                   </Badge>
//                 </div>

//                 {/* Logout — icon only */}
//                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                   <Button
//                     size="icon" variant="ghost"
//                     onClick={handleLogout}
//                     title="Logout"
//                     className="rounded-xl size-9 text-blue-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors"
//                   >
//                     <LogOut className="size-4" />
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* ── MOBILE HAMBURGER ──────────────────────────────────── */}
//           <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//             <SheetTrigger asChild>
//               <Button
//                 variant="ghost" size="icon"
//                 suppressHydrationWarning
//                 className="lg:hidden rounded-xl size-9 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/30"
//               >
//                 <AnimatePresence mode="wait">
//                   {mobileOpen
//                     ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X className="size-5" /></motion.div>
//                     : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu className="size-5" /></motion.div>
//                   }
//                 </AnimatePresence>
//               </Button>
//             </SheetTrigger>

//             <SheetContent
//               side="right"
//               className="w-72 p-0 flex flex-col bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-blue-100/60 dark:border-blue-900/30"
//             >
//               {/* Header */}
//               <SheetHeader className="px-5 pt-5 pb-4 border-b border-blue-100/60 dark:border-blue-900/30">
//                 <SheetTitle className="flex items-center gap-2">
//                   <img src="/SyntaxSpace.png" alt="SyntaxSpace" className="h-7 w-auto" />
//                   <span className="font-bold text-[15px]">
//                     <span className="text-blue-600 dark:text-blue-400">Syntax</span>
//                     <span className="text-blue-900 dark:text-blue-100">Space</span>
//                   </span>
//                 </SheetTitle>
//               </SheetHeader>

//               {/* User info card */}
//               {user && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.25, delay: 0.05 }}
//                   className="mx-4 mt-4 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-800/40"
//                 >
//                   <p className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">{user.name}</p>
//                   <Badge className={cn("mt-1 gap-1 text-[10px] font-bold px-1.5 py-0 h-4 border-0 rounded-md", roleMeta[user.role].cls)}>
//                     {roleMeta[user.role].icon}
//                     {roleMeta[user.role].label}
//                   </Badge>
//                 </motion.div>
//               )}

//               {/* Links */}
//               <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
//                 {allLinks.map((item, i) => (
//                   <motion.div key={item.title} custom={i} variants={mobileItemVariant} initial="hidden" animate="visible">
//                     <Link
//                       href={item.url}
//                       onClick={() => setMobileOpen(false)}
//                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-900/65 dark:text-blue-200/65 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
//                     >
//                       <span className="text-blue-400 dark:text-blue-500">{item.icon}</span>
//                       {item.title}
//                     </Link>
//                   </motion.div>
//                 ))}
//               </nav>

//               {/* Footer */}
//               <div className="px-4 pb-6 pt-3 border-t border-blue-100/60 dark:border-blue-900/30 space-y-2">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => setTheme("light")}
//                       title="Light mode"
//                       className="p-2 rounded-xl text-blue-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
//                     >
//                       <Sun className="size-[15px]" />
//                     </button>
//                     <button
//                       onClick={() => setTheme("dark")}
//                       title="Dark mode"
//                       className="p-2 rounded-xl text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors"
//                     >
//                       <Moon className="size-[15px]" />
//                     </button>
//                   </div>
//                 </div>

//                 {!user ? (
//                   <>
//                     <Button
//                       asChild variant="outline"
//                       className="w-full rounded-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                       onClick={() => setMobileOpen(false)}
//                     >
//                       <Link href="/login">Login</Link>
//                     </Button>
//                     <Button
//                       asChild
//                       className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow shadow-blue-500/20"
//                       onClick={() => setMobileOpen(false)}
//                     >
//                       <Link href="/signup">Signup</Link>
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     className="w-full rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/25 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-100 dark:border-red-900/30"
//                     onClick={() => { handleLogout(); setMobileOpen(false); }}
//                   >
//                     <LogOut className="size-4 mr-2" />
//                     Logout
//                   </Button>
//                 )}
//               </div>
//             </SheetContent>
//           </Sheet>

//         </div>
//       </motion.header>
//     </div>
//   );
// }


