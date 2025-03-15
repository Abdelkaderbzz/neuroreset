"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  variant?: "default" | "menu"
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between w-full">
        <span>Theme</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", theme === "light" && "bg-accent text-accent-foreground")}
            onClick={() => setTheme("light")}
            aria-label="Light theme"
          >
            <Sun className="h-[1rem] w-[1rem]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", theme === "dark" && "bg-accent text-accent-foreground")}
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
          >
            <Moon className="h-[1rem] w-[1rem]" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

