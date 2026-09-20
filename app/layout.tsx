import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Digital Mass Fantasy Faceoff",
  description: "Two ESPN fantasy football leagues. One ultimate champion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <footer className="site-footer">
          <img src="/brand/dm-cloud-white.png" alt="" />
          <span>Digital Mass Fantasy Faceoff · 2026 Season</span>
        </footer>
      </body>
    </html>
  );
}
