import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Header() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-primary-950/80 backdrop-blur-md border-b border-primary-800/5 dark:border-secondary-50/10">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="/"
          className="font-display text-xl font-semibold text-primary-800 dark:text-secondary-50"
        >
          RS<span className="text-primary-800/40 dark:text-secondary-50/40">.</span>
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#projects"
            className="text-sm font-medium text-primary-800/70 dark:text-secondary-50/70 hover:text-primary-800 dark:hover:text-secondary-50 transition-colors duration-300"
          >
            Work
          </a>
          <button
            onClick={() => setDark((prev) => !prev)}
            className="p-2 rounded-full text-primary-800 dark:text-secondary-50 hover:bg-primary-800/5 dark:hover:bg-secondary-50/10 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
