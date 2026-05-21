"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { key: "light" as const, icon: Sun, label: "亮色" },
  { key: "dark" as const, icon: Moon, label: "暗色" },
  { key: "system" as const, icon: Monitor, label: "系统" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          title={label}
          className={`
            relative flex items-center justify-center rounded-md p-1.5
            transition-all duration-200
            ${theme === key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }
          `}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
