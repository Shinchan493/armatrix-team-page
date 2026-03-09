"use client";

import styles from "./TeamCard.module.css";

const DEPT_COLORS = {
    Leadership: "var(--accent-gold)",
    Engineering: "var(--accent-cyan)",
    Design: "var(--accent-magenta)",
    Operations: "#4ADE80",
    Marketing: "#A78BFA",
};

export default function TeamCard({ member, index, onClick }) {
    return (
        <div
            className={`${styles.card} animate-fade-in-up stagger-${(index % 8) + 1}`}
            onClick={() => onClick(member)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(member)}
        >
            {/* Department glow accent */}
            <div
                className={styles.accentGlow}
                style={{
                    background: `radial-gradient(circle, ${DEPT_COLORS[member.department] || "var(--accent-cyan)"}22 0%, transparent 70%)`,
                }}
            />

            <div className={styles.avatarWrap}>
                <img
                    src={member.photo_url}
                    alt={member.name}
                    className={styles.avatar}
                    loading="lazy"
                />
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <span
                    className={styles.badge}
                    style={{
                        color: DEPT_COLORS[member.department] || "var(--accent-cyan)",
                        borderColor: `${DEPT_COLORS[member.department] || "var(--accent-cyan)"}44`,
                    }}
                >
                    {member.department}
                </span>
            </div>

            {member.linkedin && (
                <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.social}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${member.name}'s LinkedIn`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
