"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? " compact" : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Light mode yoqish" : "Dark mode yoqish"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span aria-hidden="true" className="theme-toggle__icon">
        {isDark ? "☀" : "☾"}
      </span>
      {!compact && <span className="theme-toggle__label">{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}

