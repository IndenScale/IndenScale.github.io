"use client";

import { type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  as?: "div" | "a";
}

export function GlowCard({ children, className = "", href, as = "div" }: GlowCardProps) {
  const baseClasses = `
    glow-card group relative overflow-hidden rounded-xl
    border border-border bg-card
    transition-all duration-300 ease-out
    hover:border-transparent hover:shadow-lg
    ${className}
  `;

  const glowOverlay = (
    <>
      <div className="glow-border pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={baseClasses}>
        {glowOverlay}
        <div className="relative z-10">{children}</div>
      </a>
    );
  }

  return (
    <div className={baseClasses}>
      {glowOverlay}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
