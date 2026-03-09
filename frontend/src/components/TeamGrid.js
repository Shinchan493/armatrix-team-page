"use client";

import TeamCard from "./TeamCard";
import styles from "./TeamGrid.module.css";

export default function TeamGrid({ members, onCardClick }) {
    if (!members || members.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No team members yet. Add someone using the admin panel below!</p>
            </div>
        );
    }

    return (
        <section className={styles.section} id="team-grid">
            <div className={styles.grid}>
                {members.map((member, i) => (
                    <TeamCard
                        key={member.id}
                        member={member}
                        index={i}
                        onClick={onCardClick}
                    />
                ))}
            </div>
        </section>
    );
}
