"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP-powered scroll-triggered animation wrapper.
 * Wraps children and animates them when they enter the viewport.
 *
 * @param {string} variant - 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
 * @param {number} delay - seconds to delay start
 * @param {boolean} stagger - if true, staggers direct children (for grids)
 * @param {number} staggerAmount - stagger delay per child
 */
export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  stagger = false,
  staggerAmount = 0.08,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const variants = {
      fadeUp: { y: 50, opacity: 0 },
      fadeIn: { opacity: 0 },
      slideLeft: { x: -60, opacity: 0 },
      slideRight: { x: 60, opacity: 0 },
    };

    const from = variants[variant] || variants.fadeUp;
    const targets = stagger ? el.children : el;

    gsap.set(targets, from);

    const tween = gsap.to(targets, {
      ...Object.fromEntries(Object.keys(from).map((k) => [k, 0])),
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay,
      stagger: stagger ? staggerAmount : 0,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [variant, delay, stagger, staggerAmount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
