"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const titleWords = ["Meet", "the", "Minds", "Behind", "Armatrix"];

export default function TeamHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.22]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -130]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0]);

  return (
    <section ref={sectionRef} className="page-container relative flex min-h-screen flex-col items-center justify-center py-24 text-center md:py-28">
      <div className="pointer-events-none absolute -top-8 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[var(--accent-cyan-glow)] blur-3xl" />
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[var(--text-tertiary)]"
      >
        Team
      </motion.p>

      <motion.h1
        style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
        className="mt-4 max-w-5xl font-[var(--font-heading)] text-4xl font-semibold leading-[0.98] text-[var(--text-primary)] will-change-transform md:mt-6 md:text-7xl lg:text-[5.6rem]"
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {word}{index < titleWords.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
        className="mt-8 max-w-3xl text-balance text-sm leading-relaxed text-[var(--text-secondary)] md:text-lg"
      >
        A focused team of roboticists, designers, and systems thinkers building fluid intelligence for
        constrained industrial environments.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-3"
      >
        <span className="grid h-5 w-5 place-items-center rounded-[2px] border border-white/35">
          <Image src="/armatrix-favicon.ico" alt="Armatrix" width={10} height={10} className="opacity-75" />
        </span>
        <span className="text-[1.55rem] font-semibold uppercase leading-none tracking-[0.08em] text-white/70 md:text-[1.7rem]">
          Scroll
        </span>
        <span className="grid h-5 w-5 place-items-center rounded-[2px] border border-white/35">
          <Image src="/armatrix-favicon.ico" alt="Armatrix" width={10} height={10} className="opacity-75" />
        </span>
      </motion.div>
    </section>
  );
}
