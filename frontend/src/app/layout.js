import "./globals.css";

export const metadata = {
  title: "Team — Armatrix",
  description:
    "Meet the team behind Armatrix — building snake-like robotic arms for confined and hazardous spaces.",
  openGraph: {
    title: "Team — Armatrix",
    description:
      "Meet the team behind Armatrix — building snake-like robotic arms for confined and hazardous spaces.",
    siteName: "Armatrix",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
