import { ChevronDown, ChevronUp, ChevronsUpDown, SearchX } from 'lucide-react';
import type { SortBy } from '../../types';
import { useDerivedFinancials } from '../../hooks/useDerivedFinancials';
import { useRole } from '../../hooks/useRole';
import { useFinanceStore } from '../../store/useFinanceStore';
import { TransactionRow } from './TransactionRow';

const COLUMNS: { key: SortBy | null; label: string; align?: 'left' | 'right' }[] = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: null, label: 'Type' },
  { key: 'amount', label: 'Amount', align: 'right' },
];

export function TransactionTable() {
  const { filtered } = useDerivedFinancials();
  const filters = useFinanceStore((s) => s.filters);
  const setFilter = useFinanceStore((s) => s.setFilter);
  const resetFilters = useFinanceStore((s) => s.resetFilters);
  const { can } = useRole();

  const handleSort = (column: SortBy) => {
    if (filters.sortBy === column) {
      setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
      return;
    }

    setFilter('sortBy', column);
    setFilter('sortDir', 'desc');
  };

  const SortIcon = ({ column }: { column: SortBy }) => {
    if (filters.sortBy !== column) {
      return <ChevronsUpDown size={12} className="ml-1.5 opacity-35" />;
    }

    return filters.sortDir === 'asc'
      ? <ChevronUp size={12} className="ml-1.5 text-blue" />
      : <ChevronDown size={12} className="ml-1.5 text-blue" />;
  };

  return (
    <div className="overflow-x-auto">
      {filtered.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--border-subtle)] bg-white/[0.03]">
            <SearchX size={28} className="text-[var(--text-dim)]" />
          </div>
          <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text-main)]">
            No matching transactions
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
            Adjust your filters or reset the search to bring records back into view.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 inline-flex items-center justify-center rounded-2xl border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-blue transition hover:bg-blue/10"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <table className="fin-table">
          <thead>
            <tr className="bg-white/[0.02]">
              {COLUMNS.map(({ key, label, align }) => (
                <th
                  key={label}
                  onClick={() => key && handleSort(key)}
                  className={[
                    align === 'right' ? 'text-right' : '',
                    key ? 'cursor-pointer hover:text-[var(--text-main)]' : 'cursor-default',
                  ].join(' ')}
                >
                  <span className={`inline-flex items-center ${align === 'right' ? 'justify-end' : ''}`}>
                    {label}
                    {key && <SortIcon column={key} />}
                  </span>
                </th>
              ))}
              {can('edit') && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-[var(--border-subtle)] bg-white/[0.02] px-6 py-4 text-sm text-[var(--text-dim)] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold uppercase tracking-[0.14em]">Visible records</span>
          <span>
            Total results: <strong className="text-[var(--text-main)]">{filtered.length}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
