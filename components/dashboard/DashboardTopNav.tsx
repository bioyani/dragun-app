'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Settings, FileText, LogOut, ChevronDown } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface Props {
  merchantName: string;
}

export default function DashboardTopNav({ merchantName }: Props) {
  const t = useTranslations('Dashboard');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const initials = merchantName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <div className="hidden sm:flex badge badge-outline border-base-300 text-base-content/60 text-[10px] md:text-xs py-2 px-3">
        {merchantName}
      </div>

      {/* Avatar + Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 group"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="avatar placeholder ring-1 ring-primary/20 rounded-full p-0.5">
            <div className="bg-base-300 text-base-content/60 rounded-full w-7 md:w-8 transition-colors group-hover:bg-base-300">
              <span className="text-[10px] md:text-xs font-bold">{initials}</span>
            </div>
          </div>
          <ChevronDown
            className={`w-3 h-3 text-base-content/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-base-200 border border-base-300 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden py-1">
            {/* Header */}
            <div className="px-4 py-3 border-b border-base-300">
              <p className="text-xs font-bold text-base-content truncate">{merchantName}</p>
              <p className="text-[10px] text-base-content/50 mt-0.5">{t('merchant')}</p>
            </div>

            {/* Items */}
            <a
              href="#settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/60 hover:text-base-content hover:bg-base-300/60 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{t('agentParams')}</span>
            </a>

            <a
              href="#knowledge"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/60 hover:text-base-content hover:bg-base-300/60 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{t('ragContext')}</span>
            </a>

            <div className="border-t border-base-300 mt-1 pt-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/50 hover:text-base-content hover:bg-base-300/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('backToSite')}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
