"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

// ponytail: simple hydration guard; upgrade to useHydrated hook if reused widely
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!mounted) return <div className="flex gap-0.5 rounded-full bg-muted/80 p-1 h-8 w-[68px]" />;

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-muted/80 p-0.5 border border-border/40">
      <button
        onClick={() => setTheme("light")}
        className={`rounded-full p-1.5 transition-all ${
          theme === "light"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Mode terang"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`rounded-full p-1.5 transition-all ${
          theme === "dark"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Mode gelap"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

