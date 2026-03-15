"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LayoutGroup, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamBackground3D from "@/components/team/TeamBackground3D";
import TeamHero from "@/components/team/TeamHero";
import TeamIntroOverlay from "@/components/team/TeamIntroOverlay";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import TeamMemberModal from "@/components/team/TeamMemberModal";
import TeamSkeleton from "@/components/team/TeamSkeleton";
import AdminPanel from "@/components/AdminPanel";
import { fetchTeamMembers } from "@/lib/api";
import type { TeamMember } from "@/lib/team-types";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 85, damping: 24, mass: 0.35 });
  useMotionValueEvent(smoothScroll, "change", (value) => setScrollProgress(value));
  const barScaleX = useTransform(smoothScroll, [0, 1], [0, 1]);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTeamMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError("Could not fetch team members. Please check if backend is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Silently refresh members without showing the loading skeleton. */
  const refreshMembers = useCallback(async () => {
    try {
      const data = await fetchTeamMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <>
      <TeamIntroOverlay />
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: barScaleX }}
        className="fixed top-0 left-0 right-0 z-[999] h-[2px] origin-left bg-gradient-to-r from-cyan-500 via-cyan-300 to-white shadow-[0_0_8px_rgba(34,211,238,0.8)]"
      />
      <CustomCursor />
      <Navbar />
      <TeamBackground3D scrollProgress={scrollProgress} />

      <main className="relative z-10 min-h-screen">
        <TeamHero />

        {loading ? (
          <TeamSkeleton />
        ) : error ? (
          <section className="page-container pt-24 pb-32 md:pt-32 md:pb-40">
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 text-center backdrop-blur-xl">
              <p className="text-sm text-[var(--text-secondary)]">{error}</p>
              <button
                onClick={loadMembers}
                className="mt-5 rounded-full border border-[var(--border-subtle)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
              >
                Retry
              </button>
            </div>
          </section>
        ) : (
          <LayoutGroup>
            <section className="page-container flex flex-col items-center pt-24 pb-32 md:pt-32 md:pb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mx-auto mb-16 max-w-3xl text-center md:mb-20"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Our team</p>
                <h2 className="mt-4 font-[var(--font-heading)] text-3xl text-[var(--text-primary)] md:text-5xl">
                  The people building Armatrix.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  From robotics and perception to product design and platform engineering, our team
                  builds dependable systems for real industrial environments.
                </p>
              </motion.div>

              <div className="mx-auto grid w-full max-w-full justify-center gap-10 md:gap-14 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),360px))] md:[grid-template-columns:repeat(auto-fit,minmax(320px,380px))]">
                {members.map((member, index) => (
                  <TeamMemberCard key={member.id} member={member} index={index} onSelect={setSelectedMember} />
                ))}
              </div>
            </section>

            <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
          </LayoutGroup>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="page-container mt-8 mb-16 md:mb-24"
        >
          <div className="join-us-card relative overflow-hidden rounded-[2.5rem] border border-cyan-500/20 bg-[var(--bg-card)] p-10 text-center backdrop-blur-xl sm:p-14 md:p-20">
            {/* Animated grid background */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* Breathing glow rim */}
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-cyan-400/30 animate-[breatheGlow_3s_ease-in-out_infinite]" />
            <p className="relative text-[0.86rem] font-semibold uppercase tracking-[0.32em] text-[var(--text-tertiary)]">Join us</p>
            <h3
              className="relative mt-3 text-[2rem] font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] md:text-[3rem]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Build the future of robotics with us.
            </h3>
            <a
              href="https://armatrix.in/careers"
              target="_blank"
              rel="noreferrer"
              className="relative mt-6 inline-flex min-w-[230px] justify-center rounded-full border border-cyan-300/40 bg-cyan-400/12 px-9 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.2em] text-cyan-100 shadow-[0_0_0_1px_rgba(103,232,249,0.12),0_0_32px_rgba(34,211,238,0.18)] transition hover:border-cyan-200/70 hover:bg-cyan-300/18 hover:text-white hover:shadow-[0_0_0_1px_rgba(165,243,252,0.18),0_0_40px_rgba(34,211,238,0.24)]"
            >
              View Open Roles
            </a>
          </div>
        </motion.section>

        {!loading && !error ? (
          <section className="page-container pt-24 pb-32 md:pt-32 md:pb-40">
            <AdminPanel members={members} onMembersChange={loadMembers} onSilentRefresh={refreshMembers} setMembers={setMembers} />
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
