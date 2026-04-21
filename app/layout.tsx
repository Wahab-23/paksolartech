import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paksolartech.com"),
  title: {
    default: "PakSolarTech — Premium Solar Energy Solutions",
    template: "%s | PakSolarTech"
  },
  description:
    "Pakistan's leading solar energy company. Save up to 90% on electricity with our residential, commercial, and battery storage solutions.",
  keywords: ["solar panels", "solar energy", "Pakistan", "renewable energy", "solar installation", "Karachi solar", "net metering"],
  authors: [{ name: "PakSolarTech Team" }],
  creator: "PakSolarTech",
  publisher: "PakSolarTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PakSolarTech — Premium Solar Energy Solutions",
    description:
      "Save up to 90% on electricity with Pakistan's leading solar provider. Professional installation and 25-year warranty.",
    url: "https://paksolartech.com",
    siteName: "PakSolarTech",
    type: "website",
    images: [
      {
        url: "https://paksolartech.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PakSolarTech Solar Solutions",
      },
    ],
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSolarTech — Solar Energy Solutions",
    description: "Harness the power of the sun. Save on bills and go green.",
    images: ["https://paksolartech.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
