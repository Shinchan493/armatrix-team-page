"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LayoutGroup, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamBackground3D from "@/components/team/TeamBackground3D";
import TeamHero from "@/components/team/TeamHero";
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

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <TeamBackground3D scrollProgress={scrollProgress} />

      <main className="relative z-10 min-h-screen">
        <TeamHero />

        {loading ? (
          <TeamSkeleton />
        ) : error ? (
          <section className="page-container pb-28">
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
            <section className="page-container flex flex-col items-center pb-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="mx-auto mb-14 max-w-3xl text-center"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Our team</p>
                <h2 className="mt-4 font-[var(--font-heading)] text-3xl text-[var(--text-primary)] md:text-5xl">
                  Engineering command, centered in focus.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  The team behind Armatrix brings together robotics, product design, perception,
                  and platform engineering to build dependable systems for real industrial environments.
                </p>
              </motion.div>

              <div className="mx-auto grid w-fit max-w-full justify-center gap-8 [grid-template-columns:repeat(auto-fit,minmax(320px,360px))]">
                {members.map((member, index) => (
                  <TeamMemberCard key={member.id} member={member} index={index} onSelect={setSelectedMember} />
                ))}
              </div>

              <div className="mt-14 w-full">
                <AdminPanel members={members} onMembersChange={loadMembers} />
              </div>
            </section>

            <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
          </LayoutGroup>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="page-container pb-24"
        >
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 text-center backdrop-blur-xl md:p-9">
            <p className="text-[0.86rem] font-semibold uppercase tracking-[0.32em] text-[var(--text-tertiary)]">Join us</p>
            <h3
              className="mt-3 text-[2rem] font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] md:text-[3rem]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Build the future of robotics with us.
            </h3>
            <a
              href="https://armatrix.in/careers"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-[var(--border-subtle)] px-7 py-3.5 text-[0.84rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
            >
              View Open Roles
            </a>
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
