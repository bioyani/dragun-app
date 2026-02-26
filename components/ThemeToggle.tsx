'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const applyTheme = (value: 'light' | 'dark' | 'system') => {
    const isDark =
      value === 'dark' ||
      (value === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);
  };

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    applyTheme(saved);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
      if (current === 'system') applyTheme('system');
    };
    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, []);

  const toggle = () => {
    const order: Array<'system' | 'dark' | 'light'> = ['system', 'dark', 'light'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Theme: ${theme}. Click to switch`}
      className="flex items-center justify-center w-8 h-8 rounded-xl border border-base-content/5 bg-base-300/40 text-base-content/60 hover:text-base-content hover:bg-base-300/60 transition-all"
    >
      {theme === 'dark' && <Sun className="w-3.5 h-3.5" />}
      {theme === 'light' && <Moon className="w-3.5 h-3.5" />}
      {theme === 'system' && <Monitor className="w-3.5 h-3.5" />}
    </button>
  );
}
