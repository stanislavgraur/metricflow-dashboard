'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart2,
  Search,
  Calendar,
  ChevronDown,
  Sun,
  Moon,
  Check,
  X,
  TrendingUp,
  Receipt,
  User,
  CreditCard,
  Users,
  LogOut,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark';
export type DateRangeOption = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year';

export interface SearchItem {
  id: string;
  type: 'metric' | 'transaction';
  label: string;
  hint: string;
}

export interface HeaderProps {
  userName?: string;
  userEmail?: string;
  avatarSrc?: string;
  initialDateRange?: DateRangeOption | 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year';
  onDateRangeChange?: (range: 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year') => void;
  onThemeChange?: (theme: ThemeMode) => void;
  onSearchSelect?: (item: SearchItem) => void;
  onLogout?: () => void;
  searchItems?: SearchItem[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DATE_RANGES: DateRangeOption[] = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days',
  'This Year',
];

const SEARCH_INDEX: SearchItem[] = [
  { id: 'm-1', type: 'metric', label: 'Total Revenue', hint: '$2,797.3M · +14.2%' },
  { id: 'm-2', type: 'metric', label: 'MRR', hint: '$692.4K · +14.2%' },
  { id: 'm-3', type: 'metric', label: 'Active Users', hint: '3,336 · +14.2%' },
  { id: 'm-4', type: 'metric', label: 'Conversion Rate', hint: '26.92% · +14.2%' },
  { id: 't-1', type: 'transaction', label: 'Transaction #12001305', hint: 'Hanes Smith · $276.00' },
  { id: 't-2', type: 'transaction', label: 'Transaction #12005302', hint: 'Google Dences · $197.00' },
  { id: 't-3', type: 'transaction', label: 'Transaction #12006741', hint: 'Stripe Checkout · $1,420.00' },
  { id: 't-4', type: 'transaction', label: 'Transaction #12008920', hint: 'Acme Corp · $850.50' },
];

// ============================================================================
// SMALL HELPERS
// ============================================================================

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-900 dark:bg-[#0F172A] border border-slate-700 dark:border-[#334155] rounded">
    {children}
  </kbd>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Header: React.FC<HeaderProps> = ({
  userName = 'Alex Morgan',
  userEmail = 'alex@metricflow.io',
  avatarSrc = 'https://i.pravatar.cc/80?img=12',
  initialDateRange = 'Last 30 Days',
  onDateRangeChange,
  onThemeChange,
  onSearchSelect,
  onLogout,
  searchItems: externalSearchItems,
}) => {
  const [dateRange, setDateRange] = useState<DateRangeOption | 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'This Year'>(initialDateRange);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Мемоизированные search items
  const searchIndex = useMemo(() => {
    if (externalSearchItems) return externalSearchItems;
    return SEARCH_INDEX;
  }, [externalSearchItems]);

  /* Закрытие dropdown по клику вне */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Глобальный хоткей ⌘K / Ctrl+K и Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDropdownOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openSearch = () => {
    setQuery('');
    setActiveIndex(0);
    setSearchOpen(true);
  };

  /* Фокус инпута + блокировка скролла при открытой модалке */
  useEffect(() => {
    if (!searchOpen) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  /* Переключение класса темы на <html> */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex;
    return searchIndex.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q)
    );
  }, [query, searchIndex]);

  const selectRange = (r: DateRangeOption) => {
    setDateRange(r);
    setDropdownOpen(false);
    onDateRangeChange?.(r);
  };

  const toggleTheme = (t: ThemeMode) => {
    setTheme(t);
    onThemeChange?.(t);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    onLogout?.();
  };

  const selectItem = (item: SearchItem) => {
    setSearchOpen(false);
    onSearchSelect?.(item);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filtered[activeIndex]) {
      selectItem(filtered[activeIndex]);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center gap-6">
          {/* ================= Logo ================= */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BarChart2 className="w-6 h-6 text-[#6366F1]" strokeWidth={2.5} />
            <span className="text-[var(--foreground)] font-bold text-xl tracking-tight">MetricFlow</span>
          </Link>

          {/* ================= Global Search (триггер Command Palette) ================= */}
          <div className="flex-1 flex justify-center px-4">
            <button
              onClick={openSearch}
              className="w-full max-w-[420px] h-10 flex items-center gap-2 bg-[var(--surface)]/60 border border-[var(--border)] rounded-lg pl-3 pr-3 text-sm text-[var(--muted)] hover:border-[#6366F1]/60 hover:text-[var(--foreground)] transition-colors"
            >
              <Search className="w-4 h-4 text-[var(--muted)]" />
              <span className="flex-1 text-left">Global Search...</span>
              <Kbd>⌘K</Kbd>
            </button>
          </div>

          {/* ================= Right Block ================= */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Date Range Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-2 h-10 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)]/50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">{dateRange}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-2 w-44 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl shadow-black/40 py-1 z-50"
                >
                  {DATE_RANGES.map((r) => (
                    <button
                      key={r}
                      role="option"
                      aria-selected={r === dateRange}
                      onClick={() => selectRange(r)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        r === dateRange
                          ? 'text-[var(--foreground)] bg-[var(--border)]/50'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/40'
                      }`}
                    >
                      {r}
                      {r === dateRange && <Check className="w-4 h-4 text-[#6366F1]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              <button
                onClick={() => toggleTheme('light')}
                aria-label="Light theme"
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'light'
                    ? 'bg-[var(--border)] text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                aria-label="Dark theme"
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'bg-[var(--border)] text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* User Avatar with Profile Dropdown */}
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-label={userName}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="shrink-0 rounded-full bg-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/60 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={avatarSrc}
                  alt={userName}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl shadow-black/40 py-1 z-50 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-sm font-medium text-[var(--foreground)]">{userName}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{userEmail}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/40 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/40 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing & Plans
                    </button>
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/40 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Team Members
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[var(--border)]" />

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-[var(--border)]/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================
          COMMAND PALETTE / SEARCH MODAL
          ================================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative mx-auto mt-24 w-[calc(100%-2rem)] max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--border)]">
              <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search metrics, transactions..."
                data-gramm="false"
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="w-4 h-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                  No results for "{query}"
                </div>
              ) : (
                (['metric', 'transaction'] as const).map((type) => {
                  const items = filtered.filter((i) => i.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <div className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
                        {type === 'metric' ? 'Metrics' : 'Transactions'}
                      </div>
                      {items.map((item) => {
                        const idx = filtered.indexOf(item);
                        return (
                          <button
                            key={item.id}
                            onClick={() => selectItem(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              idx === activeIndex ? 'bg-[var(--border)]/50' : ''
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center w-7 h-7 rounded-md border border-[var(--border)] bg-slate-900 dark:bg-[#0F172A] shrink-0 ${
                                item.type === 'metric' ? 'text-[#10B981]' : 'text-[#818CF8]'
                              }`}
                            >
                              {item.type === 'metric' ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <Receipt className="w-3.5 h-3.5" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm text-[var(--foreground)] truncate">
                                {item.label}
                              </span>
                              <span className="block text-xs text-[var(--muted)] truncate">
                                {item.hint}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-3 px-4 h-9 border-t border-[var(--border)] bg-slate-900/60 dark:bg-[#0F172A]/60 text-[10px] text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd> select
              </span>
              <span className="ml-auto flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd> toggle
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
