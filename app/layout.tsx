import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import CookieBanner from "../components/CookieBanner";
import BackButton from "../components/BackButton";
import BackToTop from "../components/BackToTop";
import ReferralTracker from "../components/ReferralTracker";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://empire-chapeau-noir.vercel.app"),
  title: {
    default: "Empire Chapeau Noir",
    template: "%s — Empire Chapeau Noir",
  },
  description:
    "Formation, accompagnement et création de contenu — Empire Chapeau Noir.",
  openGraph: {
    siteName: "Empire Chapeau Noir",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper-50 text-base-950 dark:bg-base-950 dark:text-paper-50 font-body antialiased">
        <Header />
        <BackButton />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
