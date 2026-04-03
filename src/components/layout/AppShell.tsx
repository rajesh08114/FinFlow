import {
  BarChart3,
  LayoutDashboard,
  List,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { RoleSwitcher } from '../shared/RoleSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: List },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
];

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-(--border-subtle) bg-surface backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-360 items-center gap-3 px-4 py-3 sm:px-6">
          <button
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border-subtle) bg-white/2 text-(--text-muted) transition hover:bg-white/5 hover:text-(--text-main)"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue to-pink text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)]">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-black tracking-tight gradient-text">FinFlow</p>
              <p className="truncate text-[11px] font-semibold tracking-[0.14em] text-(--text-dim) uppercase">
                Finance command center
              </p>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-2 lg:flex">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => [
                  'flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-white/6 text-(--text-main) shadow-sm'
                    : 'text-(--text-muted) hover:bg-white/4 hover:text-(--text-main)',
                ].join(' ')}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <RoleSwitcher />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''} lg:hidden`}
        onClick={closeMobile}
      />

      <aside className={`mobile-sidebar ${mobileOpen ? 'open' : ''} lg:hidden`}>
        <div className="flex items-center justify-between border-b border-(--border-subtle) px-5 py-5">
          <div>
            <p className="font-display text-lg font-black tracking-tight text-(--text-main)">
              Navigation
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Move across the workspace
            </p>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-(--border-subtle) text-(--text-muted) transition hover:bg-white/5 hover:text-(--text-main)"
            onClick={closeMobile}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 py-5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMobile}
              className={({ isActive }) => [
                'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-white/8 text-(--text-main)'
                  : 'text-(--text-muted) hover:bg-white/4 hover:text-(--text-main)',
              ].join(' ')}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="mt-4 rounded-2xl border border-(--border-subtle) bg-white/3 p-3">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Access mode
            </p>
            <RoleSwitcher />
          </div>
        </div>

        <div className="border-t border-(--border-subtle) px-5 py-4 text-[12px] text-(--text-dim)">
          Local-first finance tracking with responsive analytics.
        </div>
      </aside>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-(--border-subtle) bg-white/2">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-1 px-4 py-5 text-sm text-(--text-dim) sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="font-medium text-(--text-muted)">FinFlow workspace</span>
          
          <span className="font-medium text-(--text-muted)">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
