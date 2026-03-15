"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

/**
 * Custom cursor — small dot with magnetic lag, grows on hover over interactives.
 * Hidden on touch devices. Matches armatrix.in's cursor effect.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    setVisible(true);

    const onMouseMove = (e) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;
    };

    const onMouseOver = (e) => {
      const tag = e.target.closest("a, button, [role='button'], input, textarea, select");
      setHovering(!!tag);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const p = pos.current;
      p.x += (p.targetX - p.x) * 0.15;
      p.y += (p.targetY - p.y) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={dotRef}
      className={`${styles.cursor} ${hovering ? styles.hovering : ""}`}
    />
  );
}
