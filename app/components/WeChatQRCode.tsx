"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export function WeChatQRCode() {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowQR(!showQR)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="显示微信二维码"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
        </svg>
        微信
      </button>

      {showQR && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-card border border-border rounded-xl shadow-lg z-50">
          <button
            onClick={() => setShowQR(false)}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
            aria-label="关闭"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="w-36 h-36 bg-muted rounded-lg flex items-center justify-center">
            <Image
              src="/wechat-qr.png"
              alt="微信二维码"
              width={144}
              height={144}
              className="rounded-lg"
              unoptimized
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="text-xs text-muted-foreground text-center p-4">将 wechat-qr.png<br/>放入 public 目录</div>';
                }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            扫码添加微信
          </p>
        </div>
      )}
    </div>
  );
}
