import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/components/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RavePass — концерты за рубежом",
  description: "Агрегатор концертов мировых артистов за рубежом для жителей России и СНГ. Фильтрация по визам и прямым рейсам.",
  icons: {
    icon: "/favicon.svg",
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
      </body>
    </html>
  );
}
