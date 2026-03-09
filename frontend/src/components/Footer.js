import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <p className={styles.brand}>
                    <span className={styles.logo}>ARMATRIX</span>
                    <span className={styles.tagline}>
                        Snake-like robotic arms for confined &amp; hazardous spaces
                    </span>
                </p>
                <p className={styles.copy}>
                    © {new Date().getFullYear()} Armatrix Automations Pvt. Ltd.
                </p>
            </div>
        </footer>
    );
}
