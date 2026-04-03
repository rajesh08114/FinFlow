import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import {
  computeBalance,
  computeTotalIncome,
  computeTotalExpenses,
  groupByCategory,
  groupByMonth,
  getTopCategory,
  getBestIncomeMonth,
  getBiggestExpense,
  getAvgMonthlySpend,
  applyFilters,
  applySort,
} from '../utils';

export function useDerivedFinancials() {
  const transactions = useFinanceStore((s) => s.transactions);
  const filters      = useFinanceStore((s) => s.filters);

  const filtered = useMemo(
    () => applySort(applyFilters(transactions, filters), filters.sortBy, filters.sortDir),
    [transactions, filters]
  );

  const totalBalance  = useMemo(() => computeBalance(transactions),       [transactions]);
  const totalIncome   = useMemo(() => computeTotalIncome(transactions),   [transactions]);
  const totalExpenses = useMemo(() => computeTotalExpenses(transactions), [transactions]);
  const netWorth      = useMemo(() => totalIncome - totalExpenses,        [totalIncome, totalExpenses]);

  const byCategory    = useMemo(() => groupByCategory(transactions),      [transactions]);
  const byMonth       = useMemo(() => groupByMonth(transactions),         [transactions]);

  const topCategory   = useMemo(() => getTopCategory(transactions),       [transactions]);
  const bestMonth     = useMemo(() => getBestIncomeMonth(byMonth),        [byMonth]);
  const biggestExpense = useMemo(() => getBiggestExpense(transactions),   [transactions]);
  const avgMonthlySpend = useMemo(() => getAvgMonthlySpend(byMonth),     [byMonth]);

  const currentMonthKey = () => new Date().toISOString().substring(0, 7);
  const prevMonthKey    = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().substring(0, 7);
  };

  const currentMonth = byMonth.find(m => m.monthKey === currentMonthKey());
  const prevMonth    = byMonth.find(m => m.monthKey === prevMonthKey());

  const lastTwo = byMonth.slice(-2);
  const lastMonth    = lastTwo[1] || lastTwo[0];
  const prevLastMonth = lastTwo[0];

  const balanceTrend = lastMonth && prevLastMonth && prevLastMonth.balance !== 0
    ? ((lastMonth.balance - prevLastMonth.balance) / Math.abs(prevLastMonth.balance)) * 100
    : 0;

  const incomeTrend = lastMonth && prevLastMonth && prevLastMonth.income !== 0
    ? ((lastMonth.income - prevLastMonth.income) / prevLastMonth.income) * 100
    : 0;

  const expenseTrend = lastMonth && prevLastMonth && prevLastMonth.expenses !== 0
    ? ((lastMonth.expenses - prevLastMonth.expenses) / prevLastMonth.expenses) * 100
    : 0;

  return {
    filtered,
    totalBalance,
    totalIncome,
    totalExpenses,
    netWorth,
    byCategory,
    byMonth,
    topCategory,
    bestMonth,
    biggestExpense,
    avgMonthlySpend,
    balanceTrend,
    incomeTrend,
    expenseTrend,
    currentMonth,
    prevMonth,
  };
}
