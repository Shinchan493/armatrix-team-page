"use client";

import styles from "./HeroSection.module.css";
import { SplineScene } from "@/components/ui/splite";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Spline 3D full-screen background */}
      <div className={styles.splineBackground}>
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className={styles.content}>
        <p className={styles.label}>/001 — THE PEOPLE</p>
        <h1 className={styles.title}>
          <span className={styles.thin}>Meet the</span>{" "}
          <span className={styles.accent}>Team</span>
        </h1>
        <p className={styles.subtitle}>
          The engineers, designers, and operators building snake-like robotic
          arms that inspect where humans can&apos;t reach.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
