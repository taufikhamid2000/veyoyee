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
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`text-gray-200 hover:text-white hover:bg-blue-800/50 ${
          theme === "light" ? "bg-blue-800/60 text-white" : ""
        }`}
        title="Light mode"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`text-gray-200 hover:text-white hover:bg-blue-800/50 ${
          theme === "dark" ? "bg-blue-800/60 text-white" : ""
        }`}
        title="Dark mode"
      >
        <Moon className="h-5 w-5" />
        <span className="sr-only">Dark mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`text-gray-200 hover:text-white hover:bg-blue-800/50 ${
          theme === "system" ? "bg-blue-800/60 text-white" : ""
        }`}
        title="System preference"
      >
        <Laptop className="h-5 w-5" />
        <span className="sr-only">System preference</span>
      </Button>
    </div>
  );
}
