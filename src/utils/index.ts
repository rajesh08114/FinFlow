import { CATEGORY_COLORS } from '../constants/categories';
import type { Category, CategoryBreakdown, MonthlyData, Transaction } from '../types';

const INR_SYMBOL = '\u20b9';

export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 10_00_000) {
    return `${INR_SYMBOL}${(amount / 10_00_000).toFixed(1)}L`;
  }

  if (Math.abs(amount) >= 1_000) {
    return `${INR_SYMBOL}${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  return `${INR_SYMBOL}${amount.toFixed(0)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function computeTotalIncome(txns: Transaction[]): number {
  return txns.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

export function computeTotalExpenses(txns: Transaction[]): number {
  return txns.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function computeBalance(txns: Transaction[]): number {
  return computeTotalIncome(txns) - computeTotalExpenses(txns);
}

export function groupByCategory(txns: Transaction[]): CategoryBreakdown[] {
  const expenseOnly = txns.filter((t) => t.type === 'expense');
  const total = expenseOnly.reduce((sum, t) => sum + t.amount, 0);
  const totalsByCategory: Record<string, number> = {};

  expenseOnly.forEach((transaction) => {
    totalsByCategory[transaction.category] = (totalsByCategory[transaction.category] || 0) + transaction.amount;
  });

  return Object.entries(totalsByCategory)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[category as Category] || '#94A3B8',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function groupByMonth(txns: Transaction[]): MonthlyData[] {
  const totalsByMonth: Record<string, { income: number; expenses: number }> = {};

  txns.forEach((transaction) => {
    const key = transaction.date.substring(0, 7);

    if (!totalsByMonth[key]) {
      totalsByMonth[key] = { income: 0, expenses: 0 };
    }

    if (transaction.type === 'income') {
      totalsByMonth[key].income += transaction.amount;
    } else {
      totalsByMonth[key].expenses += transaction.amount;
    }
  });

  return Object.entries(totalsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => {
      const date = new Date(key + '-01');

      return {
        month: date.toLocaleString('en-IN', { month: 'short' }),
        monthKey: key,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
      };
    });
}

export function getTopCategory(txns: Transaction[]): CategoryBreakdown | null {
  const breakdown = groupByCategory(txns);
  return breakdown[0] || null;
}

export function getBestIncomeMonth(monthly: MonthlyData[]): MonthlyData | null {
  if (!monthly.length) return null;
  return monthly.reduce((best, month) => (month.income > best.income ? month : best), monthly[0]);
}

export function getBiggestExpense(txns: Transaction[]): Transaction | null {
  const expenses = txns.filter((t) => t.type === 'expense');
  if (!expenses.length) return null;

  return expenses.reduce((max, transaction) => (
    transaction.amount > max.amount ? transaction : max
  ), expenses[0]);
}

export function getAvgMonthlySpend(monthly: MonthlyData[]): number {
  if (!monthly.length) return 0;

  const recent = monthly.slice(-3);
  return recent.reduce((sum, month) => sum + month.expenses, 0) / recent.length;
}

export function applyFilters(txns: Transaction[], filters: {
  search: string;
  category: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}): Transaction[] {
  return txns.filter((transaction) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesText =
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.note?.toLowerCase().includes(query) ||
        String(transaction.amount).includes(query);

      if (!matchesText) return false;
    }

    if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }

    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }

    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false;
    }

    return true;
  });
}

export function applySort(txns: Transaction[], sortBy: string, sortDir: string): Transaction[] {
  const dir = sortDir === 'asc' ? 1 : -1;

  return [...txns].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return dir * a.date.localeCompare(b.date);
      case 'amount':
        return dir * (a.amount - b.amount);
      case 'category':
        return dir * a.category.localeCompare(b.category);
      case 'description':
        return dir * a.description.localeCompare(b.description);
      default:
        return dir * a.date.localeCompare(b.date);
    }
  });
}

export function exportToCSV(txns: Transaction[]): void {
  const headers = ['ID', 'Date', 'Description', 'Amount (INR)', 'Type', 'Category', 'Note'];

  const escape = (val: string | number) => {
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = txns.map((transaction) => [
    escape(transaction.id),
    escape(formatDate(transaction.date)),
    escape(transaction.description),
    escape(transaction.amount),
    escape(transaction.type),
    escape(transaction.category),
    escape(transaction.note || ''),
  ].join(','));

  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `finflow-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  window.setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 200);
}
