import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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
        <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <a href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
              Rave<span className="text-orange-500">Pass</span>
            </a>
            <span className="text-xs text-zinc-500 hidden sm:inline">концерты за рубежом</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 py-8 text-center space-y-2">
          <p className="text-sm font-medium">
            Rave<span className="text-orange-500">Pass</span>
          </p>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} RavePass. Все права защищены.
          </p>
          <p className="text-xs text-zinc-600">
            Визовая информация носит справочный характер. Проверяйте данные в официальных источниках.
          </p>
        </footer>
      </body>
    </html>
  );
}
