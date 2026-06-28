import { useState, useEffect } from "react";
import { ThemeContext } from "@/app/providers/ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const html = document.documentElement;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      if (resolvedTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    };

    applyTheme();

    mediaQuery.addEventListener("change", applyTheme);

    localStorage.setItem("theme", theme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
