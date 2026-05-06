// tested:

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  RiBookOpenLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiSparklingLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import Background from "./Background";
// import { Background } from "@/components/Background";

const TRUST_BADGES = [
  { icon: RiShieldCheckLine, text: "No credit card required" },
  { icon: RiTimeLine, text: "Free trial available" },
  { icon: RiSparklingLine, text: "Cancel anytime" },
];

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax for the icon
  const iconY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <Background
      as="section"
      variant="aurora"
      grid
      decorations
      aurora
      accent
      grain
      animate
      className="py-24 md:py-32"
    >
      <div ref={containerRef} className="relative mx-auto w-full max-w-5xl px-4 text-center">
        {/* Floating icon */}
        <motion.div
          style={{ y: iconY }}
          className="mb-8 inline-flex"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 4, 0, -4, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-2xl scale-150" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
              <RiBookOpenLine className="h-10 w-10 text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
        >
          Ready to Start Learning?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join thousands of students who are already mastering new skills with
          expert guidance
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="px-10 text-lg h-14 rounded-xl bg-white text-violet-700 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl shadow-white/20 font-bold"
          >
            <Link href="/signup">
              Get Started Free
              <RiArrowRightLine className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-10 text-lg h-14 rounded-xl border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
              <Icon className="h-4 w-4 text-white/40" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </Background>
  );
}















// "use client";

// import React, { useRef } from "react";
// import Link from "next/link";
// import { motion, useScroll, useTransform } from "framer-motion";
// import {
//   RiBookOpenLine,
//   RiArrowRightLine,
//   RiShieldCheckLine,
//   RiTimeLine,
//   RiSparklingLine,
// } from "react-icons/ri";
// import { Button } from "@/components/ui/button";
// import Background from "./Background";
// // import { Background } from "@/components/Background";

// const TRUST_BADGES = [
//   { icon: RiShieldCheckLine, text: "No credit card required" },
//   { icon: RiTimeLine, text: "Free trial available" },
//   { icon: RiSparklingLine, text: "Cancel anytime" },
// ];

// export default function CTASection() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   // Parallax for the icon
//   const iconY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

//   return (
//     <Background
//       as="section"
//       variant="aurora"
//       grid
//       decorations
//       aurora
//       accent
//       grain
//       animate
//       className="py-24 md:py-32"
//     >
//       <div ref={containerRef} className="relative mx-auto w-full max-w-5xl px-4 text-center">
//         {/* Floating icon */}
//         <motion.div
//           style={{ y: iconY }}
//           className="mb-8 inline-flex"
//         >
//           <motion.div
//             animate={{
//               y: [0, -10, 0],
//               rotate: [0, 4, 0, -4, 0],
//             }}
//             transition={{
//               duration: 5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//             className="relative"
//           >
//             <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-2xl scale-150" />
//             <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
//               <RiBookOpenLine className="h-10 w-10 text-white" />
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Headline */}
//         <motion.h2
//           initial={{ opacity: 0, y: 24 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
//           className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
//         >
//           Ready to Start Learning?
//         </motion.h2>

//         {/* Subtext */}
//         <motion.p
//           initial={{ opacity: 0, y: 24 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
//           className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
//         >
//           Join thousands of students who are already mastering new skills with
//           expert guidance
//         </motion.p>

//         {/* CTAs */}
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
//           className="flex flex-wrap gap-4 justify-center"
//         >
//           <Button
//             asChild
//             size="lg"
//             className="px-10 text-lg h-14 rounded-xl bg-white text-violet-700 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl shadow-white/20 font-bold"
//           >
//             <Link href="/signup">
//               Get Started Free
//               <RiArrowRightLine className="ml-2 h-5 w-5" />
//             </Link>
//           </Button>
//           <Button
//             asChild
//             variant="outline"
//             size="lg"
//             className="px-10 text-lg h-14 rounded-xl border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-200 font-semibold"
//           >
//             <Link href="/about">Learn More</Link>
//           </Button>
//         </motion.div>

//         {/* Trust badges */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.45 }}
//           className="mt-10 flex flex-wrap items-center justify-center gap-6"
//         >
//           {TRUST_BADGES.map(({ icon: Icon, text }) => (
//             <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
//               <Icon className="h-4 w-4 text-white/40" />
//               {text}
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </Background>
//   );
// }