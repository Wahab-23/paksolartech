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
  manifest: "/uploads/favicon/manifest.json",
  icons: {
    icon: [
      { url: "/uploads/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/uploads/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/uploads/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/uploads/favicon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/uploads/favicon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/uploads/favicon/apple-icon-precomposed.png",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#009399",
    "msapplication-TileImage": "/uploads/favicon/ms-icon-144x144.png",
    "msapplication-config": "/uploads/favicon/browserconfig.xml",
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
