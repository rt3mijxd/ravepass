import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SettingsProvider } from "@/components/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ravepass.site";
const title = "RavePass — Concerts abroad, filtered by your passport";
const description =
  "Find concerts abroad you can actually reach — filtered by your passport's visa requirements and direct flights. Концерты за рубежом с фильтром по визам и прямым рейсам.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "concerts abroad", "visa-free concerts", "concert travel", "RavePass",
    "world tours", "концерты за рубежом", "концерты без визы", "туры артистов",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "RavePass",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('ravepass_theme') !== 'light') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <SettingsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
