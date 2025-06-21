"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={theme === "light" ? "bg-slate-100 dark:bg-slate-800" : ""}
        title="Light mode"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "bg-slate-100 dark:bg-slate-800" : ""}
        title="Dark mode"
      >
        <Moon className="h-5 w-5" />
        <span className="sr-only">Dark mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={theme === "system" ? "bg-slate-100 dark:bg-slate-800" : ""}
        title="System preference"
      >
        <Laptop className="h-5 w-5" />
        <span className="sr-only">System preference</span>
      </Button>
    </div>
  );
}
