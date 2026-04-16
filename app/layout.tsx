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
  title: "PakSolarTech — Premium Solar Energy Solutions",
  description:
    "Pakistan's leading solar energy company. Harness the power of the sun with our cutting-edge solar panel installations, maintenance, and consulting services.",
  keywords: "solar panels, solar energy, Pakistan, renewable energy, solar installation",
  openGraph: {
    title: "PakSolarTech — Premium Solar Energy Solutions",
    description:
      "Pakistan's leading solar energy company. Harness the power of the sun with our cutting-edge solar panel installations, maintenance, and consulting services.",
    url: "https://paksolartech.com",
    siteName: "PakSolarTech",
    type: "website",
    images: ["/og-image.png"],
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
