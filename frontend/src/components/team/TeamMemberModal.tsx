"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { TeamMember } from "@/lib/team-types";

type Props = {
  member: TeamMember | null;
  onClose: () => void;
};

export default function TeamMemberModal({ member, onClose }: Props) {
  const isDicebearAvatar = member?.photo_url?.includes("api.dicebear.com") ?? false;

  return (
    <AnimatePresence>
      {member ? (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:px-8 md:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <motion.button
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.article
            layoutId={`card-${member.id}`}
            layout
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.9 }}
            className="relative z-10 max-h-[84vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] border border-[var(--border-hover)] bg-[rgba(7,10,18,0.9)] p-6 md:p-12"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 md:right-8 md:top-8 rounded-full border border-[var(--border-subtle)] px-4 py-2 text-xs tracking-wider text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
            >
              CLOSE
            </button>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
              <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)]">
                <Image
                  src={member.photo_url}
                  alt={member.name}
                  width={1200}
                  height={1200}
                  unoptimized={isDicebearAvatar}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center justify-center pt-4 text-center md:pt-8">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[var(--text-accent)]"
                >
                  {member.role}
                </motion.p>
                <h2
                  className="mt-3 flex flex-wrap justify-center gap-x-[0.18em] text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] md:text-[3.6rem]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  aria-label={member.name}
                >
                  {member.name.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.18 + i * 0.032, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={char === " " ? "w-[0.28em]" : "inline-block"}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </h2>
                <div className="mt-4 h-px w-12 bg-[var(--accent-cyan)] opacity-60" />
                <p className="mt-5 max-w-2xl text-[0.93rem] leading-[1.75] text-[var(--text-secondary)] md:text-[1rem]">{member.bio}</p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="group/btn flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 py-2.5 text-[var(--text-secondary)] transition-all duration-200 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">LinkedIn</span>
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="group/btn flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 py-2.5 text-[var(--text-secondary)] transition-all duration-200 hover:border-white/40 hover:bg-white/5 hover:text-[var(--text-primary)]"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
