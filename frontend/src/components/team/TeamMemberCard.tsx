"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { type MouseEvent, useMemo, useState } from "react";
import type { TeamMember } from "@/lib/team-types";

type Props = {
  member: TeamMember;
  index: number;
  onSelect: (member: TeamMember) => void;
};

export default function TeamMemberCard({ member, index, onSelect }: Props) {
  const fallbackPhotoUrl = useMemo(
    () => `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=transparent`,
    [member.name],
  );
  const [imageSrc, setImageSrc] = useState(member.photo_url || fallbackPhotoUrl);
  const isDicebearAvatar = imageSrc.includes("api.dicebear.com");
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { damping: 12, stiffness: 200 });
  const springY = useSpring(rotateY, { damping: 12, stiffness: 200 });

  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const onMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    rotateY.set((px - 0.5) * 32);
    rotateX.set((0.5 - py) * 32);
    setGlowPosition({ x: px * 100, y: py * 100 });
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <motion.button
      layoutId={`card-${member.id}`}
      onClick={() => onSelect(member)}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.06, type: "spring", damping: 16, stiffness: 120 }}
      whileHover={{ y: -6 }}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative min-h-[420px] w-full max-w-[360px] overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-center backdrop-blur-xl transition-colors duration-300 hover:border-[var(--border-hover)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(0,229,255,0.22), transparent 70%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: "0 0 26px rgba(0,212,255,0.16)" }} />

      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={imageSrc}
          alt={member.name}
          width={900}
          height={900}
          unoptimized={isDicebearAvatar}
          onError={() => setImageSrc(fallbackPhotoUrl)}
          className="h-72 w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.05] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="relative pb-1 pt-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-tertiary)]">{member.role}</p>
        <h3
          className="mt-2 text-[1.65rem] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >{member.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{member.bio.slice(0, 138)}...</p>
      </div>
    </motion.button>
  );
}
