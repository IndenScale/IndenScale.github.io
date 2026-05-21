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
  description: "Agent 架构、运营工业化、施工管理计算化。记录思考与实践。",
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
          <div className="max-w-3xl mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold tracking-tight">
                IndenScale
              </a>
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <a href="/bim" className="hover:text-foreground transition-colors">BIM</a>
                <a href="/ops" className="hover:text-foreground transition-colors">运营工业化</a>
                <a href="/architecture" className="hover:text-foreground transition-colors">架构</a>
                <a href="/projects" className="hover:text-foreground transition-colors">项目</a>
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
          <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-muted-foreground text-center">
            © 2026 宋涤非 (IndenScale)
          </div>
        </footer>
      </body>
    </html>
  );
}
