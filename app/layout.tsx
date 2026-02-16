import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "软件工程、智能体、网络安全、领域建模",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold tracking-tight">
                IndenScale
              </a>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="/" className="hover:text-foreground transition-colors">
                  首页
                </a>
                <a href="/posts" className="hover:text-foreground transition-colors">
                  文章
                </a>
                <a 
                  href="https://github.com/IndenScale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-border mt-20">
          <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-muted-foreground text-center">
            © 2026 宋涤非 (IndenScale). All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
