import { useEffect, useState } from 'react';
import { Download, ListFilter, Plus, RotateCcw, Search } from 'lucide-react';
import type { Category, Filters } from '../../types';
import { CATEGORY_LIST } from '../../constants/categories';
import { useDerivedFinancials } from '../../hooks/useDerivedFinancials';
import { useRole } from '../../hooks/useRole';
import { useFinanceStore } from '../../store/useFinanceStore';
import { exportToCSV } from '../../utils';

const SEARCH_DEBOUNCE_MS = 250;

export function TransactionFilters() {
  const filters = useFinanceStore((s) => s.filters);
  const setFilter = useFinanceStore((s) => s.setFilter);
  const resetFilters = useFinanceStore((s) => s.resetFilters);
  const setAddModalOpen = useFinanceStore((s) => s.setAddModalOpen);
  const { filtered } = useDerivedFinancials();
  const { isAdmin } = useRole();
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    if (searchDraft === filters.search) return;

    const timeoutId = window.setTimeout(() => {
      setFilter('search', searchDraft);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search, searchDraft, setFilter]);

  return (
    <div className="glass p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
        <label className="relative block xl:col-span-2">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
          />
          <input
            id="filter-search"
            type="text"
            className="input pl-11"
            placeholder="Search description, amount, category, or note"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />
        </label>

        <label className="relative block">
          <select
            id="filter-category"
            className="input"
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value as Category | 'all')}
          >
            <option value="all">All categories</option>
            {CATEGORY_LIST.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ListFilter
            size={14}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
          />
        </label>

        <select
          id="filter-type"
          className="input"
          value={filters.type}
          onChange={(e) => setFilter('type', e.target.value as Filters['type'])}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          <input
            id="filter-date-from"
            type="date"
            className="input"
            value={filters.dateFrom}
            onChange={(e) => setFilter('dateFrom', e.target.value)}
            title="From date"
          />
          <input
            id="filter-date-to"
            type="date"
            className="input"
            value={filters.dateTo}
            onChange={(e) => setFilter('dateTo', e.target.value)}
            title="To date"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          id="filter-reset"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-main)]"
          onClick={() => {
            setSearchDraft('');
            resetFilters();
          }}
          title="Reset filters"
        >
          <RotateCcw size={14} />
          Reset filters
        </button>

        {isAdmin ? (
          <>
            <button
              id="export-csv"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-main)]"
              onClick={() => exportToCSV(filtered)}
              title="Export visible records as CSV"
            >
              <Download size={14} />
              Export visible rows
            </button>

            <button
              id="add-transaction-btn"
              className="btn-gradient inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus size={15} />
              Add transaction
            </button>
          </>
        ) : (
          <div className="inline-flex h-11 items-center rounded-2xl border border-cyan/20 bg-cyan/10 px-4 text-sm font-semibold text-cyan">
            Read-only mode
          </div>
        )}
      </div>
    </div>
  );
}
