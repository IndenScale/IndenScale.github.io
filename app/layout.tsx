import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { WeChatQRCode } from "./components/WeChatQRCode";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "宋涤非 | IndenScale",
  description: "Agent 架构、运营工业化、施工管理计算化。记录思考与实践。",
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      {/* Umami Analytics - 隐私友好的访问统计，不收集个人数据，无需cookie */}
      {/* 部署后将 script-url 和 website-id 替换为你自己的 Umami 实例 */}
      {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
          defer
        />
      )}
      <body
        className={`${interSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
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
                    <a href="/eac" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">EaC</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/knowledge" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">运营工业化</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/architecture" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">架构</a>
                    <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-500" />
                    <a href="/tools" className="px-4 py-2 hover:text-foreground hover:bg-muted/60 rounded-md transition-all">工具</a>
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
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2026 宋涤非 (IndenScale)
                </p>
                <div className="flex items-center gap-6">
                  <WeChatQRCode />
                  <a
                    href="https://github.com/IndenScale"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
