import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "宋涤非 | IndenScale",
  description: "Agent 架构、运营工业化、施工管理计算化。记录思考与实践。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <header className="glass-surface glass-edge sticky top-0 z-50">
            <div className="max-w-3xl mx-auto px-6 py-4">
              <nav className="flex items-center justify-between">
                <a href="/" className="text-xl font-bold tracking-tight hover:text-muted-foreground transition-colors">
                  IndenScale
                </a>
                <div className="flex items-center gap-0">
                  <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                    <a href="/bim" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">BIM</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/ops" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">运营工业化</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/architecture" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">架构</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/projects" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">项目</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a
                      href="https://github.com/IndenScale"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all"
                    >
                      GitHub
                    </a>
                  </div>
                  <div className="ml-4">
                    <ThemeToggle />
                  </div>
                </div>
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-border mt-20">
            <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-muted-foreground text-center">
              © 2026 宋涤非 (IndenScale)
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
