"use client";

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
            <div className={styles.inner}>
                <a href="https://armatrix.in" className={styles.logo} target="_blank" rel="noopener noreferrer">
                    ARMATRIX
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
