"use client";

import Image from "next/image";
import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const titleWords = ["Meet", "the", "Minds", "Behind", "Armatrix"];

/* ---- Sine-wave path (pre-computed once) ---- */
const VB_WIDTH = 2000;
const AMP = 14;
const WAVELENGTH = 360;
const STEPS = 500;

const wavePath = (() => {
  const parts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * VB_WIDTH;
    const y = AMP * Math.sin((2 * Math.PI * x) / WAVELENGTH);
    parts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
  }
  return parts.join(" ");
})();

const VB = `0 -${AMP + 6} ${VB_WIDTH} ${(AMP + 6) * 2}`;

/* ---- ScrollWave ---- */
function ScrollWave({
  direction,
  widthPct,
}: {
  direction: "left" | "right";
  widthPct: MotionValue<string>;
}) {
  return (
    <div className="relative flex-1 min-w-0" style={{ height: 80 }}>
      <motion.div
        className="absolute inset-y-0 overflow-hidden"
        style={{
          width: widthPct,
          ...(direction === "left"
            ? { right: 0 }
            : { left: 0 }),
        }}
      >
        <svg
          viewBox={VB}
          className="absolute inset-y-0 h-full"
          style={{
            width: "50vw",
            ...(direction === "left"
              ? { right: 0, transform: "scaleX(-1)" }
              : { left: 0 }),
          }}
          preserveAspectRatio="none"
        >
          <path
            d={wavePath}
            fill="none"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="3"
            strokeDasharray="14 12"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function TeamHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.22]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -130]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0]);

  /* Snappy spring — responds fast in both scroll directions */
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    mass: 0.1,
  });

  const waveWidthPct = useTransform(smoothScroll, [0, 0.5], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center text-center"
    >
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-cyan-glow)] blur-[80px]" />

      <motion.h1
        style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
        className="page-container relative z-10 max-w-5xl font-[var(--font-heading)] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] will-change-transform md:text-7xl lg:text-[5.5rem]"
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: 0.1 + index * 0.08,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {word}
            {index < titleWords.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
        className="mt-6 max-w-2xl text-balance text-[0.95rem] leading-relaxed text-[var(--text-secondary)] md:text-lg"
      >
        A focused team of roboticists, designers, and systems thinkers building
        fluid intelligence for constrained industrial environments.
      </motion.p>

      {/* Scroll indicator — waves emerge from the logo boxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-14 left-0 right-0 flex items-center"
      >
        {/* Left wave — flush against the left box (no gap) */}
        <ScrollWave direction="left" widthPct={waveWidthPct} />

        {/* Left logo box — z-10 so it sits on top of the wave edge */}
        <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-[3px] border border-white/35 bg-black">
          <Image
            src="/armatrix-favicon.ico"
            alt="Armatrix"
            width={16}
            height={16}
            className="opacity-75"
          />
        </span>

        {/* SCROLL text */}
        <span className="shrink-0 px-4 text-[1.85rem] font-semibold uppercase leading-none tracking-[0.08em] text-white/70 md:text-[2.1rem]">
          Scroll
        </span>

        {/* Right logo box */}
        <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-[3px] border border-white/35 bg-black">
          <Image
            src="/armatrix-favicon.ico"
            alt="Armatrix"
            width={16}
            height={16}
            className="opacity-75"
          />
        </span>

        {/* Right wave — flush against the right box */}
        <ScrollWave direction="right" widthPct={waveWidthPct} />
      </motion.div>
    </section>
  );
}
