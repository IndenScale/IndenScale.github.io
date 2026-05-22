"use client";

import { type ReactNode } from "react";

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  noise?: boolean;
  intensity?: number;
  as?: "div" | "section" | "article" | "main" | "header" | "footer" | "aside" | "nav";
}

export function LiquidGlassCard({
  children,
  className = "",
  tilt = false,
  noise = false,
  as: Tag = "div",
}: LiquidGlassCardProps) {
  return (
    <Tag
      className={`glass-surface glass-edge group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-px ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
