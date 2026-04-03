import { Eye, Shield } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

export function RoleSwitcher() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const isAdmin = role === 'admin';

  return (
    <div
      className="inline-flex w-full items-center rounded-full border border-[var(--border-subtle)] bg-white/[0.03] p-1 shadow-inner sm:w-auto"
      role="group"
      aria-label="Role switcher"
    >
      <button
        id="role-btn-admin"
        onClick={() => setRole('admin')}
        aria-pressed={isAdmin}
        className={[
          'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition',
          isAdmin
            ? 'btn-gradient text-white'
            : 'text-[var(--text-dim)] hover:bg-white/[0.04] hover:text-[var(--text-main)]',
        ].join(' ')}
      >
        <Shield size={12} strokeWidth={2.5} />
        Admin
      </button>
      <button
        id="role-btn-viewer"
        onClick={() => setRole('viewer')}
        aria-pressed={!isAdmin}
        className={[
          'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition',
          !isAdmin
            ? 'btn-gradient text-white'
            : 'text-[var(--text-dim)] hover:bg-white/[0.04] hover:text-[var(--text-main)]',
        ].join(' ')}
      >
        <Eye size={12} strokeWidth={2.5} />
        Viewer
      </button>
    </div>
  );
}
