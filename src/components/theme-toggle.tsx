import { useEffect, useState } from "react";

const LIGHT = "#f6f5f2";
const DARK = "#141413";
let themeTimer = 0;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) root.classList.add("theme-anim");
    window.requestAnimationFrame(() => {
      root.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? DARK : LIGHT);
      setDark(next);
      if (!reduce) {
        window.clearTimeout(themeTimer);
        themeTimer = window.setTimeout(() => root.classList.remove("theme-anim"), 360);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex min-h-11 items-center px-2 text-sm text-muted"
    >
      <span className="inline-grid">
        <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${dark ? "opacity-0" : "opacity-100"}`} aria-hidden={dark}>
          Dark
        </span>
        <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${dark ? "opacity-100" : "opacity-0"}`} aria-hidden={!dark}>
          Light
        </span>
      </span>
    </button>
  );
}
