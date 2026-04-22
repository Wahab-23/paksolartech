import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Outfit } from "next/font/google";
import "./globals.css";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PakSolarTech",
  "url": "https://paksolartech.com",
  "logo": "https://paksolartech.com/Logo/PakSolarTech%20Logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-311-1096664",
    "contactType": "customer service",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  }
};

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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/Logo/PakSolarTech Logo.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK" suppressHydrationWarning>

      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Google Analytics */}

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2V0GYL1NTY"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2V0GYL1NTY');
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
