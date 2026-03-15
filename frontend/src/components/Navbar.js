"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className={`${styles.inner} page-container`}>
                <a href="/team" className={styles.logo} aria-label="Armatrix team page home">
                    <Image
                        src="/armatrix-logo.webp"
                        alt="Armatrix"
                        width={220}
                        height={52}
                        priority
                        className={styles.logoImage}
                    />
                    <span className={styles.logoText}>ARMATRIX</span>
                </a>
                <div className={styles.links}>
                    <a href="https://armatrix.in" target="_blank" rel="noopener noreferrer">HOME</a>
                    <a href="/team" className={styles.active}>TEAM</a>
                    <a href="https://armatrix.in/careers" target="_blank" rel="noopener noreferrer">CAREERS</a>
                    <a href="https://armatrix.in/blog" target="_blank" rel="noopener noreferrer">BLOG</a>
                </div>
            </div>
        </nav>
    );
}
