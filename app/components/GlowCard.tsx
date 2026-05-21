"use client";

import { useRef, type ReactNode, useCallback } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(0.3); // 基础慢速 (deg/frame)
  const targetSpeedRef = useRef(0.3);

  const animate = useCallback(() => {
    // 向目标速度缓动
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;
    angleRef.current += speedRef.current;
    if (angleRef.current >= 360) angleRef.current -= 360;

    if (cardRef.current) {
      cardRef.current.style.setProperty("--glow-angle", `${angleRef.current}deg`);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseEnter = useCallback(() => {
    targetSpeedRef.current = 0.3; // 保持慢速
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseMove = useCallback(() => {
    targetSpeedRef.current = 4; // 指针移动时加速
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetSpeedRef.current = 0.3; // 恢复慢速
    // 不停止 RAF，让辉光继续缓慢旋转
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glow-card group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ease-out hover:border-transparent hover:shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ "--glow-angle": "0deg" } as React.CSSProperties}
    >
      {/* 内层遮挡：遮住 conic-gradient 中间，只留边框发光 */}
      <div className="glow-inner" />
      {/* 微弱的内部渐变 */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
