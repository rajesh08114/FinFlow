import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { DeleteConfirmDialog } from '../components/transactions/DeleteConfirmDialog';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';

export function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="glass page-hero">
        <div className="page-hero-content max-w-3xl">
          <p className="page-hero-kicker">
          Transactions
          </p>
          <h1 className="page-hero-title">
            Activity ledger
          </h1>
          <p className="page-hero-copy max-w-2xl">
            Filter, sort, audit, and maintain every transaction from one responsive ledger view.
          </p>
        </div>
      </header>

      <TransactionFilters />

      <div className="glass overflow-hidden p-0">
        <TransactionTable />
      </div>

      <AddTransactionModal />
      <DeleteConfirmDialog />
    </div>
  );
}
