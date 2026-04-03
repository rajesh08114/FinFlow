import { Plus, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Category, Transaction } from '../../types';
import { CATEGORY_LIST } from '../../constants/categories';
import { useFinanceStore } from '../../store/useFinanceStore';

export function AddTransactionModal() {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const addModalOpen = useFinanceStore((s) => s.addModalOpen);
  const setAddModalOpen = useFinanceStore((s) => s.setAddModalOpen);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense' as Transaction['type'],
    category: 'Food & Dining' as Category,
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = addModalOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [addModalOpen]);

  if (!addModalOpen) return null;

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'Enter an amount greater than zero';
    if (!form.date) nextErrors.date = 'Date is required';
    if (form.date > today) nextErrors.date = 'Date cannot be in the future';

    return nextErrors;
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const closeModal = () => {
    setAddModalOpen(false);
    setErrors({});
  };

  const handleSubmit = () => {
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      note: form.note.trim() || undefined,
      createdAt: Date.now(),
    };

    addTransaction(transaction);
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food & Dining',
      note: '',
    });
    closeModal();
  };

  return (
    <div className="modal-overlay animate__animated animate__fadeIn" onClick={(event) => event.target === event.currentTarget && closeModal()}>
      <div className="modal animate__animated animate__zoomIn">
        <button
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:bg-white/[0.05] hover:text-[var(--text-main)]"
          onClick={closeModal}
          aria-label="Close add transaction modal"
        >
          <X size={18} />
        </button>

        <header className="mb-6 flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue">
            <Sparkles size={20} />
          </div>
          <div className="pr-10">
            <h2 className="font-display text-2xl font-black tracking-tight text-[var(--text-main)]">
              Add transaction
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Capture a new income or expense record for this workspace.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-5">
          <div className="grid gap-2 sm:grid-cols-2">
            {(['expense', 'income'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateField('type', type)}
                className={[
                  'rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                  form.type === type
                    ? type === 'expense'
                      ? 'border-rose/30 bg-rose/10 text-rose'
                      : 'border-green/30 bg-green/10 text-green'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-main)]',
                ].join(' ')}
              >
                {type === 'expense' ? 'Expense' : 'Income'}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
              Description
            </label>
            <input
              className="input"
              placeholder="e.g. Swiggy - Lunch order"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            {errors.description && <p className="mt-2 text-sm text-rose">{errors.description}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
                Amount (INR)
              </label>
              <input
                className="input font-mono"
                type="number"
                min="1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => updateField('amount', e.target.value)}
              />
              {errors.amount && <p className="mt-2 text-sm text-rose">{errors.amount}</p>}
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
                Date
              </label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
              {errors.date && <p className="mt-2 text-sm text-rose">{errors.date}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
              Category
            </label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              {CATEGORY_LIST.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
              Note
            </label>
            <textarea
              className="input min-h-[96px] resize-none"
              placeholder="Optional context for the transaction"
              value={form.note}
              onChange={(e) => updateField('note', e.target.value)}
            />
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border-subtle)] px-5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-main)]"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="btn-gradient inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold"
              onClick={handleSubmit}
              id="modal-confirm-add"
            >
              <Plus size={15} />
              Save transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
