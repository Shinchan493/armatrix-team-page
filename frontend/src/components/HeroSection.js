import styles from "./HeroSection.module.css";

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            {/* Atmospheric glow blobs */}
            <div className={styles.glowCyan} />
            <div className={styles.glowMagenta} />

            <div className={styles.content}>
                <p className={styles.label}>/001 — THE PEOPLE</p>
                <h1 className={styles.title}>
                    Meet the <span className={styles.accent}>Team</span>
                </h1>
                <p className={styles.subtitle}>
                    The engineers, designers, and operators building snake-like robotic
                    arms that inspect where humans can&apos;t reach.
                </p>
            </div>
        </section>
    );
}
