import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative p-2.5 rounded-full
        bg-gray-100 dark:bg-white/10
        border border-gray-200 dark:border-white/20
        backdrop-blur-md
        hover:scale-105
        transition-all duration-300
      "
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className={`
          text-lg transition-all duration-500
          ${isDark ? "text-yellow-400 rotate-180" : "text-gray-700 dark:text-white rotate-0"}
        `}
      />
    </button>
  );
}
