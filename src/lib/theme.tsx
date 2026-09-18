import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void };

const ThemeContext = createContext<Ctx>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  if (document.documentElement.classList.contains("dark")) return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light") return "light";
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline pre-hydration script in the root shell already set the class,
  // so this only mirrors the DOM state — no flash of the wrong theme.
  // Start from "dark" so SSR and the first client render agree (no hydration
  // mismatch); the effect below syncs to the real DOM state right after mount.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current = readTheme();
    setThemeState(current);
    apply(current);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem("theme", t);
    apply(t);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
