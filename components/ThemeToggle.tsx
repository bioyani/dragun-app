'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <Button
      onClick={toggle}
      variant="secondary"
      size="icon"
      aria-label={`Theme: ${theme}. Click to switch`}
      className="h-9 w-9"
    >
      {theme === 'dark' && <Sun className="h-4 w-4" />}
      {theme === 'light' && <Moon className="h-4 w-4" />}
      {theme === 'system' && <Monitor className="h-4 w-4" />}
    </Button>
  );
}
