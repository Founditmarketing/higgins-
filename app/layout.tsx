import type { Metadata, Viewport } from "next";
import { Marcellus, Cormorant_Garamond, Archivo } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#171209",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://higgins-law.vercel.app"),
  title: "Higgins Law | Trial Attorneys in Pineville, Louisiana",
  description:
    "Higgins Law is a father and son trial firm at 1603 Melrose St, Pineville, Louisiana. Over 54 years of combined experience in criminal defense, estate planning, personal injury, and juvenile law. Free consultations: 318.473.4250.",
  openGraph: {
    type: "website",
    url: "https://higgins-law.vercel.app/",
    title: "Higgins Law | Trial Attorneys in Pineville, Louisiana",
    description:
      "A father and son trial firm. Over 54 years of combined experience. The first conversation is free.",
    images: ["/assets/lawroom.jpeg"],
  },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Higgins Law",
  slogan: "Experience. Compassion. Results.",
  telephone: "+13184734250",
  url: "https://higgins-law.vercel.app",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1603 Melrose St",
    addressLocality: "Pineville",
    addressRegion: "LA",
    postalCode: "71360",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:30",
    },
  ],
  areaServed: "Central Louisiana",
  knowsAbout: [
    "Criminal Defense",
    "Estate Planning",
    "Personal Injury",
    "Juvenile Law",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${marcellus.variable} ${cormorant.variable} ${archivo.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
