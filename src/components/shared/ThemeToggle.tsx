import { useFinanceStore } from '../../store/useFinanceStore';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const theme = useFinanceStore((s) => s.theme);
  const toggleTheme = useFinanceStore((s) => s.toggleTheme);

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-muted)] transition hover:bg-white/[0.06] hover:text-[var(--text-main)] active:scale-[0.98]"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark'
        ? <Sun size={18} className="text-amber" />
        : <Moon size={18} className="text-violet" />
      }
    </button>
  );
}
