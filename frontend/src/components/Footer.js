import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} page-container`}>
        <p className={styles.brand}>
          <span className={styles.logo}>ARMATRIX</span>
          <span className={styles.tagline}>
            Snake-like robotic arms for confined &amp; hazardous spaces
          </span>
        </p>
        <div className={styles.links}>
          <a href="https://armatrix.in" target="_blank" rel="noopener noreferrer">Website</a>
          <a href="https://armatrix.in/careers" target="_blank" rel="noopener noreferrer">Careers</a>
          <a href="https://armatrix.in/blog" target="_blank" rel="noopener noreferrer">Blog</a>
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Armatrix Automations Pvt. Ltd.
        </p>
      </div>
    </footer>
  );
}
