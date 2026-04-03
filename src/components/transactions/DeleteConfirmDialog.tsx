import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';

export function DeleteConfirmDialog() {
  const deleteTargetId = useFinanceStore((s) => s.deleteTargetId);
  const setDeleteTargetId = useFinanceStore((s) => s.setDeleteTargetId);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const transactions = useFinanceStore((s) => s.transactions);

  const transaction = transactions.find((item) => item.id === deleteTargetId);

  useEffect(() => {
    document.body.style.overflow = deleteTargetId ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteTargetId]);

  if (!deleteTargetId) return null;

  return (
    <div className="modal-overlay animate__animated animate__fadeIn" onClick={(event) => event.target === event.currentTarget && setDeleteTargetId(null)}>
      <div className="modal animate__animated animate__zoomIn">
        <button
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:bg-white/[0.05] hover:text-[var(--text-main)]"
          onClick={() => setDeleteTargetId(null)}
          aria-label="Close delete dialog"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose/10 text-rose">
            <AlertTriangle size={20} />
          </div>
          <div className="pr-10">
            <h2 className="font-display text-2xl font-black tracking-tight text-[var(--text-main)]">
              Delete transaction
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              This action cannot be undone. The selected transaction will be removed from the local workspace.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-rose/20 bg-rose/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose">
            Selected record
          </p>
          <p className="mt-2 break-words text-sm font-semibold text-[var(--text-main)]">
            {transaction?.description || 'Transaction'}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border-subtle)] px-5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-main)]"
            onClick={() => setDeleteTargetId(null)}
            id="delete-cancel"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose/30 bg-rose/10 px-5 text-sm font-semibold text-rose transition hover:bg-rose/20"
            onClick={() => {
              deleteTransaction(deleteTargetId);
              setDeleteTargetId(null);
            }}
            id="delete-confirm"
          >
            <Trash2 size={15} />
            Delete transaction
          </button>
        </div>
      </div>
    </div>
  );
}
