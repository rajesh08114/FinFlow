export type Category =
  | 'Food & Dining'
  | 'Transport'
  | 'Housing'
  | 'Healthcare'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  note?: string;
  createdAt: number;
}

export interface MonthlyData {
  month: string;
  monthKey: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percent: number;
  color: string;
}

export type Role = 'admin' | 'viewer';
export type Theme = 'dark' | 'light';
export type Action = 'add' | 'edit' | 'delete' | 'export';

export type SortBy = 'date' | 'amount' | 'category' | 'description';
export type SortDir = 'asc' | 'desc';

export interface Filters {
  search: string;
  category: Category | 'all';
  type: 'all' | 'income' | 'expense';
  dateFrom: string;
  dateTo: string;
  sortBy: SortBy;
  sortDir: SortDir;
}
