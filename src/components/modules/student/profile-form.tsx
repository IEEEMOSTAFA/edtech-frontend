"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RiUser3Line, RiImageLine, RiSaveLine, RiLoader4Line, RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";
import type { StudentProfile, UpdateProfilePayload } from "@/types/student";

// Inline success Lottie JSON (lightweight checkmark animation)
const successLottie = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "check", ddd: 0,
  assets: [], layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "check", sr: 1, ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0, shapes: [{
      ty: "gr", it: [
        { ty: "sh", ks: { a: 1, k: [
          { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 10, s: [{ i: [[0,0],[0,0],[0,0]], o: [[0,0],[0,0],[0,0]], v: [[-30, 0], [-10, 20], [40, -30]], c: false }] },
          { t: 35, s: [{ i: [[0,0],[0,0],[0,0]], o: [[0,0],[0,0],[0,0]], v: [[-30, 0], [-10, 20], [40, -30]], c: false }] }
        ]}, nm: "Path 1" },
        { ty: "st", c: { a: 0, k: [0.384, 0.4, 0.945, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2, nm: "Stroke 1" },
        { ty: "tm", s: { a: 1, k: [
          { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 10, s: [0] },
          { t: 35, s: [100] }
        ]}, e: { a: 0, k: 100 }, o: { a: 0, k: 0 }, nm: "Trim Paths 1" }
      ], nm: "check"
    }], ip: 0, op: 60, st: 0, bm: 0
  }]
};

interface Props {
  profile: StudentProfile;
  saving: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (payload: UpdateProfilePayload) => void;
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  delay?: number;
}

function FloatingField({ label, icon, value, onChange, placeholder, delay = 0 }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: focused ? 1 : 0,
      duration: 0.35,
      ease: "power3.out",
      transformOrigin: "left center",
    });
  }, [focused]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-1.5"
    >
      <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className={`transition-colors duration-200 ${focused ? "text-violet-400" : ""}`}>
          {icon}
        </span>
        <span className={`transition-colors duration-200 ${focused ? "text-foreground" : ""}`}>
          {label}
        </span>
      </Label>

      <div className="relative group">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-11 bg-background/60 border-border/60 rounded-xl pr-4 pl-4 text-sm
            transition-all duration-200
            focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
            hover:border-border focus-visible:ring-violet-500/20"
        />
        {/* Animated underline accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full overflow-hidden pointer-events-none">
          <div
            ref={lineRef}
            className="h-full w-full bg-gradient-to-r from-violet-500 to-indigo-500"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ProfileForm({ profile, saving, error, success, onSubmit }: Props) {
  const [name, setName] = useState(profile.name);
  const [image, setImage] = useState(profile.image ?? "");
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: UpdateProfilePayload = {};
    if (name !== profile.name) payload.name = name;
    if (image !== profile.image) payload.image = image;
    onSubmit(payload);
  }

  const handleBtnHover = () => {
    if (!btnRef.current || saving) return;
    gsap.to(btnRef.current, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  };
  const handleBtnLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.6)" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-1"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Edit Profile
        </h2>
        <div className="flex-1 h-px bg-border/60" />
      </motion.div>

      <FloatingField
        label="Display name"
        icon={<RiUser3Line className="h-4 w-4" />}
        value={name}
        onChange={setName}
        placeholder="Your full name"
        delay={0.05}
      />

      <FloatingField
        label="Profile image URL"
        icon={<RiImageLine className="h-4 w-4" />}
        value={image}
        onChange={setImage}
        placeholder="https://example.com/avatar.jpg"
        delay={0.1}
      />

      {/* Error alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <Alert
              variant="destructive"
              className="rounded-xl border-red-500/30 bg-red-500/10 flex items-start gap-2"
            >
              <RiErrorWarningFill className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success alert with Lottie */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="rounded-xl border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2 py-3">
              <div className="h-8 w-8 flex-shrink-0">
                <Lottie animationData={successLottie} loop={false} />
              </div>
              <AlertDescription className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                <RiCheckboxCircleFill className="h-4 w-4" />
                Profile updated successfully
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          ref={btnRef}
          type="submit"
          disabled={saving}
          onMouseEnter={handleBtnHover}
          onMouseLeave={handleBtnLeave}
          className="relative w-full h-11 rounded-xl font-semibold text-sm tracking-wide overflow-hidden
            bg-gradient-to-r from-violet-600 to-indigo-600
            text-white shadow-lg shadow-violet-500/25
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-opacity duration-200
            focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2"
        >
          {/* Shimmer on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />

          <span className="relative flex items-center justify-center gap-2">
            {saving ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                >
                  <RiLoader4Line className="h-4 w-4" />
                </motion.span>
                Saving…
              </>
            ) : (
              <>
                <RiSaveLine className="h-4 w-4" />
                Save changes
              </>
            )}
          </span>
        </button>
      </motion.div>
    </form>
  );
}





// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import type { StudentProfile, UpdateProfilePayload } from "@/types/student";

// interface Props {
//   profile: StudentProfile;
//   saving: boolean;
//   error: string | null;
//   success: boolean;
//   onSubmit: (payload: UpdateProfilePayload) => void;
// }

// export function ProfileForm({
//   profile,
//   saving,
//   error,
//   success,
//   onSubmit,
// }: Props) {
//   const [name, setName] = useState(profile.name);
//   const [image, setImage] = useState(profile.image ?? "");

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const payload: UpdateProfilePayload = {};
//     if (name !== profile.name) payload.name = name;
//     if (image !== profile.image) payload.image = image;

//     onSubmit(payload);
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-1.5">
//         <Label>Display name</Label>
//         <Input value={name} onChange={(e) => setName(e.target.value)} />
//       </div>

//       <div className="space-y-1.5">
//         <Label>Profile image URL</Label>
//         <Input value={image} onChange={(e) => setImage(e.target.value)} />
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert>
//           <AlertDescription>Profile updated successfully</AlertDescription>
//         </Alert>
//       )}

//       <Button type="submit" disabled={saving} className="w-full h-11">
//         {saving ? "Saving..." : "Save changes"}
//       </Button>
//     </form>
//   );
// }