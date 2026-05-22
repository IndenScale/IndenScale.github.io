"use client";

export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Light mode: very subtle gray ambient blobs */}
      <div className="dark:hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-glow-1 opacity-[0.15] blur-[140px] animate-glow-a" />
        <div
          className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-glow-2 opacity-[0.12] blur-[130px] animate-glow-b"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-glow-3 opacity-[0.1] blur-[140px] animate-glow-c"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      {/* Dark mode: even more subtle, near-black blobs */}
      <div className="hidden dark:block">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-glow-1 opacity-[0.4] blur-[140px] animate-glow-a" />
        <div
          className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-glow-2 opacity-[0.35] blur-[130px] animate-glow-b"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-glow-3 opacity-[0.3] blur-[140px] animate-glow-c"
          style={{ animationDelay: "-12s" }}
        />
      </div>
    </div>
  );
}
