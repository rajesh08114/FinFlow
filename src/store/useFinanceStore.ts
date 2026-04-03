import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role, Theme, Filters, Action } from '../types';
import { MOCK_TRANSACTIONS } from '../constants/mockData';
import { applyTheme } from '../utils/theme';

const PERMISSIONS: Record<Role, Action[]> = {
  admin:  ['add', 'edit', 'delete', 'export'],
  viewer: [],
};

interface FinanceStore {
  transactions: Transaction[];
  addTransaction:    (t: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, val: Filters[K]) => void;
  resetFilters: () => void;

  role: Role;
  setRole: (role: Role) => void;
  can: (action: Action) => boolean;

  theme: Theme;
  toggleTheme: () => void;

  editingRowId: string | null;
  setEditingRowId: (id: string | null) => void;
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  deleteTargetId: string | null;
  setDeleteTargetId: (id: string | null) => void;
}

const DEFAULT_FILTERS: Filters = {
  search:   '',
  category: 'all',
  type:     'all',
  dateFrom: '',
  dateTo:   '',
  sortBy:   'date',
  sortDir:  'desc',
};

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const domTheme = document.documentElement.dataset.theme;
    if (domTheme === 'dark' || domTheme === 'light') {
      return domTheme;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('finflow-store');
      if (raw) {
        const parsed = JSON.parse(raw);
        const persistedTheme = parsed?.state?.theme;
        if (persistedTheme === 'dark' || persistedTheme === 'light') {
          return persistedTheme;
        }
      }
    } catch {
      // Ignore malformed persisted state and fall back to dark.
    }
  }

  return 'dark';
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,

      addTransaction: (t) =>
        set((s) => ({ transactions: [t, ...s.transactions] })),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      filters: DEFAULT_FILTERS,

      setFilter: (key, val) =>
        set((s) => ({ filters: { ...s.filters, [key]: val } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      role: 'admin',
      setRole: (role) => set({ role }),
      can: (action) => PERMISSIONS[get().role].includes(action),

      theme: getInitialTheme(),
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },

      editingRowId:    null,
      setEditingRowId: (id) => set({ editingRowId: id }),
      addModalOpen:    false,
      setAddModalOpen: (open) => set({ addModalOpen: open }),
      deleteTargetId:  null,
      setDeleteTargetId: (id) => set({ deleteTargetId: id }),
    }),
    {
      name: 'finflow-store',
      partialize: (s) => ({
        transactions: s.transactions,
        theme:        s.theme,
        role:         s.role,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
