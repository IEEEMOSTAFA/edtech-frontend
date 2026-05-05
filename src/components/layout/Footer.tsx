"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiFacebookCircleFill,
  RiYoutubeFill,
  RiMailFill,
  RiPhoneFill,
  RiMapPinFill,
  RiArrowRightUpLine,
  RiSendPlaneFill,
  RiServerLine,
  RiDatabase2Line,
  RiShieldCheckLine,
} from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Personal data from personal.ts ────────────────────────────────
const personalData = {
  name: "Md. Al Mostafa",
  title: "Backend Developer & Electrical Engineering Student",
  designation: "Backend Developer",
  bio: "SyntaxSpace is a tutor booking platform where students find experts, book sessions, and pay securely, while tutors manage availability and earnings",
  contact: {
    phone: "01889-271256",
    email: "almostafa.cu@gmail.com",
    location: "Chattogram, Bangladesh",
  },
  socialLinks: {
    github: "https://github.com/IEEEMOSTAFA",
    linkedin: "https://www.linkedin.com/in/md-al-mostafa-66817a251/",
    facebook: "https://www.facebook.com/mostafask.farhan.7",
    youtube: "https://www.youtube.com/@BackendMostafa",
  },
  availability: "Open to  Adapt New Technology",
};

// ── Nav sections ───────────────────────────────────────────────────
const sections = [
  {
    title: "For Students",
    links: [
      { label: "Browse Tutors", href: "/tutors" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "My Bookings", href: "/dashboard/bookings" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "For Tutors",
    links: [
      { label: "Become a Tutor", href: "/register?role=tutor" },
      { label: "Tutor Dashboard", href: "/tutor/dashboard" },
      { label: "Resources", href: "/resources" },
      { label: "Success Stories", href: "/stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Safety Guidelines", href: "/safety" },
    ],
  },
];

const socialLinks = [
  { Icon: RiGithubFill, href: personalData.socialLinks.github, label: "GitHub", color: "hover:text-white" },
  { Icon: RiLinkedinBoxFill, href: personalData.socialLinks.linkedin, label: "LinkedIn", color: "hover:text-blue-400" },
  { Icon: RiFacebookCircleFill, href: personalData.socialLinks.facebook, label: "Facebook", color: "hover:text-blue-500" },
  { Icon: RiYoutubeFill, href: personalData.socialLinks.youtube, label: "YouTube", color: "hover:text-red-500" },
];

const techStack = [
  { icon: RiServerLine, label: "Node.js" },
  { icon: RiServerLine, label: "Express" },
  { icon: RiDatabase2Line, label: "PostgreSQL" },
  { icon: RiShieldCheckLine, label: "Cloud" },
];

// ── Lottie animation (inline JSON — a simple wave/pulse) ───────────
// Using a CDN lottie JSON URL fallback rendered via img, or a minimal inline pulse
const pulseAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 40,
  h: 40,
  nm: "pulse",
  layers: [
    {
      ty: 4,
      nm: "circle",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60], e: [100] }, { t: 30, s: [100], e: [60] }, { t: 60, s: [60] }] },
        s: { a: 1, k: [{ t: 0, s: [80, 80], e: [110, 110] }, { t: 30, s: [110, 110], e: [80, 80] }, { t: 60, s: [80, 80] }] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        r: { a: 0, k: 0 },
      },
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [16, 16] },
          p: { a: 0, k: [0, 0] },
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.6, 0.4, 1, 1] },
          o: { a: 0, k: 100 },
          r: 1,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

gsap.registerPlugin(ScrollTrigger);

// ── Animated grid line background ─────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footer-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="footer-fade" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="rgba(109,40,217,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-grid)" />
        <rect width="100%" height="100%" fill="url(#footer-fade)" />
      </svg>
    </div>
  );
}

// ── Stagger container variant ──────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ══════════════════════════════════════════════════════════════════
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // GSAP: floating glow orb on mouse move
  useEffect(() => {
    const footer = footerRef.current;
    const glow = glowRef.current;
    if (!footer || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(glow, {
        x: x - 200,
        y: y - 200,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    footer.addEventListener("mousemove", handleMouseMove);
    return () => footer.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP: ScrollTrigger — subtle parallax on brand section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-brand-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl text-slate-300 overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Sora', sans-serif" }}
    >
      {/* ── Mesh grid background ────────────────────────────── */}
      <GridBackground />

      {/* ── Mouse-follow glow orb ───────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          top: 0,
          left: 0,
        }}
      />

      {/* ── Top accent line ─────────────────────────────────── */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      {/* ════════════════════════════════════════════════════════
          NEWSLETTER STRIP
      ════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative border-b border-violet-900/30 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-violet-950/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Lottie animationData={pulseAnimation} loop style={{ width: 36, height: 36 }} />
            <div>
              <p className="font-semibold text-white text-sm tracking-wide">Stay in the loop</p>
              <p className="text-xs text-slate-400">Tips, updates & early access — no spam.</p>
            </div>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-violet-400 font-semibold text-sm"
            >
              <RiShieldCheckLine className="size-5" />
              You're subscribed!
            </motion.div>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="bg-white/5 border-violet-800/50 text-white placeholder:text-slate-500 focus-visible:ring-violet-500 rounded-lg h-9 text-sm w-full sm:w-60"
              />
              <Button
                onClick={handleSubscribe}
                size="sm"
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg h-9 px-4 gap-1.5 font-semibold text-sm shadow-lg shadow-violet-900/40 transition-all"
              >
                <RiSendPlaneFill className="size-3.5" />
                Subscribe
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════
          MAIN FOOTER GRID
      ════════════════════════════════════════════════════════ */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mx-auto max-w-7xl px-6 py-14"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">

          {/* ── BRAND COLUMN ──────────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-2 footer-brand-text">

            {/* Logo — matches Navbar */}
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="relative shrink-0">
                <img
                  src="/images/SyntaxSpace.png"
                  alt="SyntaxSpace"
                  className="h-10 w-10 object-cover rounded-full border border-violet-700/40 shadow-md shadow-violet-900/30 group-hover:shadow-violet-600/50 transition-shadow duration-300"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0612]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight leading-none block">
                  <span className="text-blue-400">Syntax</span>
                  <span className="text-white">Space</span>
                </span>
                <span className="text-[10px] text-violet-400 tracking-widest uppercase font-medium">by {personalData.name}</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              {personalData.bio}
            </p>

            {/* Availability badge */}
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[11px] font-medium mb-6 gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {personalData.availability}
            </Badge>

            {/* Contact info */}
            <ul className="space-y-2.5">
              {[
                { Icon: RiMailFill, text: personalData.contact.email, href: `mailto:${personalData.contact.email}` },
                { Icon: RiPhoneFill, text: personalData.contact.phone, href: `tel:${personalData.contact.phone}` },
                { Icon: RiMapPinFill, text: personalData.contact.location, href: null },
              ].map(({ Icon, text, href }) => (
                <li key={text} className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Icon className="size-3.5 text-violet-400 shrink-0" />
                  {href ? (
                    <a href={href} className="hover:text-violet-300 transition-colors">{text}</a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-1.5 mt-5">
              {techStack.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-violet-950/60 border border-violet-800/40 text-violet-300 font-medium">
                  <Icon className="size-3" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── LINK SECTIONS ──────────────────────────────────── */}
          {sections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-violet-400 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <RiArrowRightUpLine className="size-3 text-violet-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6">
        <Separator className="bg-gradient-to-r from-transparent via-violet-800/40 to-transparent h-px border-0" />
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTOM BAR
      ════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Copyright */}
        <p className="text-xs text-slate-500 text-center sm:text-left">
          © {currentYear}{" "}
          <span className="text-violet-400 font-semibold">SyntaxSpace</span>
          {" "}· Crafted by{" "}
          <span className="text-slate-300 font-medium">{personalData.name}</span>
          {" "}· {personalData.designation}
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-1.5">
          {socialLinks.map(({ Icon, href, label, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.18, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border border-violet-900/50 bg-violet-950/40 text-slate-500 ${color} hover:border-violet-700/70 hover:bg-violet-900/30 transition-colors duration-200`}
            >
              <Icon className="size-[15px]" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom glow ─────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }}
      />
    </footer>
  );
}

