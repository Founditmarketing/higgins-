import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/Preloader";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#03080e",
};

export const metadata: Metadata = {
  title: "Higgins Law | Experience. Compassion. Results.",
  description:
    "Higgins Law — father-son trial attorneys in Pineville, Louisiana. Over 54 years of combined experience in Criminal Defense, Estate Planning, Personal Injury, and Juvenile Law.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${outfit.variable} antialiased`}
      >
        <Preloader />
        <CustomCursor />
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
