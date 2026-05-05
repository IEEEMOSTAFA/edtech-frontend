"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HiSparkles } from "react-icons/hi2";
import { RiShieldUserFill, RiCalendarLine } from "react-icons/ri";
import type { StudentProfile } from "@/types/student";

export function ProfileInfoCard({ profile }: { profile: StudentProfile }) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      backgroundPosition: "200% center",
      duration: 4,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    gsap.to(cardRef.current, {
      rotateX: y,
      rotateY: x,
      transformPerspective: 800,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Animated glow border */}
        <div
          ref={glowRef}
          className="absolute -inset-[1.5px] rounded-2xl opacity-70 blur-[2px] z-0"
          style={{
            background:
              "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #818cf8, #6366f1)",
            backgroundSize: "200% auto",
          }}
        />

        <Card className="relative z-10 rounded-2xl border-0 bg-background/95 backdrop-blur-sm overflow-hidden shadow-xl">
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <CardContent className="relative flex items-center gap-5 p-6">
            {/* Avatar with ring animation */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 blur-md opacity-50 scale-110" />
              <div className="relative rounded-full p-[2.5px] bg-gradient-to-br from-violet-400 to-indigo-500">
                <Avatar className="h-16 w-16 ring-2 ring-background">
                  <AvatarImage src={profile.image ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-lg tracking-wide">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Online indicator */}
              <motion.div
                className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-background shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold truncate tracking-tight">
                  {profile.name}
                </p>
                <motion.span
                  animate={{ rotate: [0, 15, -10, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <HiSparkles className="text-amber-400 h-4 w-4 flex-shrink-0" />
                </motion.span>
              </div>

              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {profile.email}
              </p>

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="gap-1.5 px-2.5 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                >
                  <RiShieldUserFill className="h-3.5 w-3.5" />
                  {profile.role}
                </Badge>

                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <RiCalendarLine className="h-3.5 w-3.5 text-indigo-400" />
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}















// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import type { StudentProfile } from "@/types/student";

// export function ProfileInfoCard({ profile }: { profile: StudentProfile }) {
//   const initials = profile.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <Card>
//       <CardContent className="flex items-center gap-4 p-6">
//         <Avatar className="h-16 w-16">
//           <AvatarImage src={profile.image ?? undefined} />
//           <AvatarFallback>{initials}</AvatarFallback>
//         </Avatar>

//         <div className="flex-1 min-w-0">
//           <p className="text-lg font-semibold truncate">{profile.name}</p>
//           <p className="text-sm text-muted-foreground truncate">
//             {profile.email}
//           </p>

//           <div className="flex items-center gap-2 mt-2">
//             <Badge variant="secondary">{profile.role}</Badge>
//             <span className="text-xs text-muted-foreground">
//               Joined{" "}
//               {new Date(profile.createdAt).toLocaleDateString("en-US", {
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }