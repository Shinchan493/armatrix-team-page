"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "armatrix-team-intro-seen";

export default function TeamIntroOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsMounted(true);

    try {
      const hasSeenIntro = window.sessionStorage.getItem(SESSION_KEY);
      if (!hasSeenIntro) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !videoRef.current) return;

    const video = videoRef.current;
    video.load();

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [isVisible]);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}

    videoRef.current?.pause();
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[2000] overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12),transparent_52%),linear-gradient(180deg,#030507_0%,#05070b_100%)]" />
          <motion.div
            initial={{ opacity: 0.4, scale: 1.03 }}
            animate={{ opacity: isReady ? 1 : 0.4, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/armatrix-intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setIsReady(true)}
              onCanPlay={() => setIsReady(true)}
              onEnded={dismiss}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
