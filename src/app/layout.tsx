import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetabolicProvider } from "@/context/MetabolicContext";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriNode — Metabolic concierge",
  description: "Quiet-luxury metabolic protocols for discerning members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var h=document.documentElement;h.classList.remove("dark","light");if(t==="light"){h.classList.add("light");h.style.colorScheme="light";}else{h.classList.add("dark");h.style.colorScheme="dark";}}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
        />
      </head>
      <body
        className="bg-[#f1f4f7] text-[#1c1e21] min-h-screen flex overflow-hidden font-sans antialiased selection:bg-primary/25 selection:text-on-background"
        suppressHydrationWarning
      >
        <MetabolicProvider>
          <DashboardShell>{children}</DashboardShell>
        </MetabolicProvider>
      </body>
    </html>
  );
}
