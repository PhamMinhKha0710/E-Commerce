"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  return {
    theme,
    setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    isSystem: theme === "system",
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  }
}
