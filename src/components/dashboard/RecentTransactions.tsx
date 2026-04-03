import { ArrowRight, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../constants/categories';
import type { Transaction } from '../../types';
import { formatCurrency, formatDateShort } from '../../utils';

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[var(--text-dim)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Recent activity
          </span>
        </div>
        <Link
          to="/transactions"
          className="group inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-blue transition hover:gap-2"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recent.map((transaction) => {
          const Icon = CATEGORY_ICONS[transaction.category];
          const color = CATEGORY_COLORS[transaction.category] || '#94A3B8';

          return (
            <div
              key={transaction.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.02] px-4 py-3.5"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-subtle)]"
                style={{ background: `${color}14` }}
              >
                <Icon size={18} style={{ color }} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                  {transaction.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-dim)]">
                  <span className="font-semibold uppercase tracking-[0.12em]">{transaction.category}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--text-dim)] opacity-40" />
                  <span>{formatDateShort(transaction.date)}</span>
                </div>
              </div>

              <div className="ml-auto text-right">
                <p className={`font-mono text-[15px] font-semibold tracking-tight ${transaction.type === 'income' ? 'text-green' : 'text-rose'}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <div className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${transaction.type === 'income' ? 'text-green/70' : 'text-rose/70'}`}>
                  {transaction.type === 'income' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {transaction.type}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
