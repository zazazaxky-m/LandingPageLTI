import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Lumiatech - Discover Engineering Technology",
    template: "%s | Lumiatech"
  },
  description:
    "Company profile and landing page foundation for Lumiatech engineering technology solutions.",
  openGraph: {
    title: "Lumiatech - Discover Engineering Technology",
    description: "Engineering technology company profile for prototypes, IT solutions, mobile apps, and cyber security.",
    type: "website",
    images: ["/images/hero-engineering-lab.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
