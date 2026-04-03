import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { Category, Transaction } from '../../types';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LIST } from '../../constants/categories';
import { useRole } from '../../hooks/useRole';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency, formatDate } from '../../utils';

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const editingRowId = useFinanceStore((s) => s.editingRowId);
  const setEditingRowId = useFinanceStore((s) => s.setEditingRowId);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const setDeleteTargetId = useFinanceStore((s) => s.setDeleteTargetId);
  const { can } = useRole();

  const isEditing = editingRowId === transaction.id;
  const Icon = CATEGORY_ICONS[transaction.category];
  const color = CATEGORY_COLORS[transaction.category] || '#94A3B8';

  const [draft, setDraft] = useState({
    date: transaction.date,
    description: transaction.description,
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
  });

  if (isEditing) {
    return (
      <tr className="animate__animated animate__fadeIn">
        <td data-label="Date">
          <input
            type="date"
            className="input w-full min-w-[9rem]"
            value={draft.date}
            onChange={(e) => setDraft((current) => ({ ...current, date: e.target.value }))}
          />
        </td>
        <td data-label="Description">
          <input
            className="input w-full"
            value={draft.description}
            onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))}
            placeholder="Description"
          />
        </td>
        <td data-label="Category">
          <select
            className="input w-full min-w-[10rem]"
            value={draft.category}
            onChange={(e) => setDraft((current) => ({ ...current, category: e.target.value as Category }))}
          >
            {CATEGORY_LIST.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </td>
        <td data-label="Type">
          <select
            className="input w-full min-w-[8rem]"
            value={draft.type}
            onChange={(e) => setDraft((current) => ({
              ...current,
              type: e.target.value as Transaction['type'],
            }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </td>
        <td data-label="Amount">
          <input
            type="number"
            min="0"
            className="input w-full min-w-[8rem] font-mono"
            value={draft.amount}
            onChange={(e) => setDraft((current) => ({ ...current, amount: e.target.value }))}
          />
        </td>
        <td data-label="Actions">
          <div className="flex gap-2">
            <button
              className="btn-gradient inline-flex h-10 w-10 items-center justify-center rounded-2xl"
              onClick={() => {
                updateTransaction(transaction.id, {
                  date: draft.date,
                  description: draft.description,
                  amount: parseFloat(draft.amount) || transaction.amount,
                  type: draft.type,
                  category: draft.category,
                });
                setEditingRowId(null);
              }}
              title="Save"
              id={`save-${transaction.id}`}
            >
              <Check size={16} />
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:bg-white/[0.05] hover:text-[var(--text-main)]"
              onClick={() => {
                setDraft({
                  date: transaction.date,
                  description: transaction.description,
                  amount: String(transaction.amount),
                  type: transaction.type,
                  category: transaction.category,
                });
                setEditingRowId(null);
              }}
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="group transition">
      <td data-label="Date" className="whitespace-nowrap text-[12px] font-medium text-[var(--text-dim)]">
        {formatDate(transaction.date)}
      </td>
      <td data-label="Description">
        <div className="flex items-start gap-3.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)]"
            style={{ background: `${color}14` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
              {transaction.description}
            </span>
            {transaction.note && (
              <span className="mt-1 block text-[11px] text-[var(--text-dim)]">
                {transaction.note}
              </span>
            )}
          </div>
        </div>
      </td>
      <td data-label="Category">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ background: `${color}14`, color }}
        >
          {transaction.category}
        </span>
      </td>
      <td data-label="Type">
        <span className={transaction.type === 'income' ? 'badge badge-income' : 'badge badge-expense'}>
          {transaction.type}
        </span>
      </td>
      <td data-label="Amount" className="text-right">
        <span className={`font-mono text-[15px] font-semibold tracking-tight ${transaction.type === 'income' ? 'text-green' : 'text-rose'}`}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      {can('edit') && (
        <td data-label="Actions">
          <div className="flex justify-end gap-2 opacity-100 md:translate-x-2 md:opacity-0 md:transition md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber transition hover:bg-amber/20"
              onClick={() => {
                setDraft({
                  date: transaction.date,
                  description: transaction.description,
                  amount: String(transaction.amount),
                  type: transaction.type,
                  category: transaction.category,
                });
                setEditingRowId(transaction.id);
              }}
              title="Edit"
              id={`edit-${transaction.id}`}
            >
              <Pencil size={14} />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose/20 bg-rose/10 text-rose transition hover:bg-rose/20"
              onClick={() => setDeleteTargetId(transaction.id)}
              title="Delete"
              id={`delete-${transaction.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
