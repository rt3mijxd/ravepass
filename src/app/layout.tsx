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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)]" style={{ background: "#09090b", color: "#f4f4f5" }}>
        <SettingsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
