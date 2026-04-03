import { Landmark, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { BentoCard } from '../components/bento/BentoCard';
import { BentoGrid } from '../components/bento/BentoGrid';
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart';
import { KpiCard } from '../components/dashboard/KpiCard';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { SpendingDonut } from '../components/dashboard/SpendingDonut';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/categories';
import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils';

export function DashboardPage() {
  const transactions = useFinanceStore((s) => s.transactions);
  const {
    avgMonthlySpend,
    balanceTrend,
    byCategory,
    byMonth,
    expenseTrend,
    incomeTrend,
    netWorth,
    topCategory,
    totalBalance,
    totalExpenses,
    totalIncome,
    bestMonth,
  } = useDerivedFinancials();

  const TopCategoryIcon = topCategory ? CATEGORY_ICONS[topCategory.category] : Landmark;

  return (
    <div className="flex flex-col gap-6">
      <header className="glass page-hero">
        <div className="pointer-events-none absolute -left-12 top-0 h-40 w-40 rounded-full bg-blue/16 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-pink/14 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-pink/12 via-blue/8 to-transparent" />
        <div className="page-hero-content max-w-3xl">
          <p className="page-hero-kicker">
            Finance overview
          </p>
          <h1 className="page-hero-title">
            Operational cash picture
          </h1>
          <p className="page-hero-copy max-w-2xl">
            Monitor liquidity, revenue, expense concentration, and recent movement from a single,
            responsive control surface.
          </p>
        </div>
      </header>

      <BentoGrid>
        <KpiCard
          title="Net liquidity"
          value={totalBalance}
          trend={balanceTrend}
          data={byMonth}
          dataKey="balance"
          accent="blue"
          icon={Wallet}
          subtitle="Available balance"
          animDelay={0}
        />
        <KpiCard
          title="Income"
          value={totalIncome}
          trend={incomeTrend}
          data={byMonth}
          dataKey="income"
          accent="pink"
          icon={TrendingUp}
          subtitle="Monthly inflow"
          animDelay={80}
        />
        <KpiCard
          title="Expenses"
          value={totalExpenses}
          trend={expenseTrend}
          data={byMonth}
          dataKey="expenses"
          accent="rose"
          icon={TrendingDown}
          subtitle="Monthly outflow"
          animDelay={160}
        />
        <KpiCard
          title="Net savings"
          value={netWorth}
          data={byMonth}
          dataKey="balance"
          accent="violet"
          icon={Landmark}
          subtitle="Income minus expenses"
          animDelay={240}
        />

        <BentoCard colSpan="col-8" rowSpan="row-2" accent="blue" animDelay={320} className="flex flex-col">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-black tracking-tight text-(--text-main)">
                Balance trajectory
              </h2>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                Six-month comparison of inflow, outflow, and closing balance
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-blue" />
                Balance
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-pink" />
                Income
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-rose" />
                Expenses
              </span>
            </div>
          </header>
          <div className="flex-1 min-h-70">
            <BalanceTrendChart data={byMonth} />
          </div>
        </BentoCard>

        <BentoCard colSpan="col-4" accent="violet" animDelay={400}>
          <header className="mb-4">
            <h2 className="font-display text-xl font-black tracking-tight text-(--text-main)">
              Expense mix
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
              Share of top spending categories
            </p>
          </header>
          <SpendingDonut data={byCategory} />
        </BentoCard>

        <BentoCard colSpan="col-4" accent="pink" animDelay={480} className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-pink/10 blur-3xl" />
          <header className="mb-6">
            <h2 className="font-display text-xl font-black tracking-tight text-(--text-main)">
              Top expense sector
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
              Highest concentration in the current dataset
            </p>
          </header>

          {topCategory ? (
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-3xl border border-(--border-subtle)"
                  style={{
                    background: `${CATEGORY_COLORS[topCategory.category]}16`,
                    color: CATEGORY_COLORS[topCategory.category],
                  }}
                >
                  <TopCategoryIcon size={28} />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl font-black tracking-tight text-(--text-main)">
                    {topCategory.category}
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-rose">
                    {formatCurrency(topCategory.amount)}
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-pink/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink">
                  {topCategory.percent.toFixed(0)}%
                </span>
              </div>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(topCategory.percent, 100)}%`,
                    background: `linear-gradient(90deg, ${CATEGORY_COLORS[topCategory.category]}, ${CATEGORY_COLORS[topCategory.category]}cc)`,
                  }}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {bestMonth && (
                  <div className="rounded-2xl border border-(--border-subtle) bg-white/3 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                      Best income month
                    </p>
                    <p className="mt-2 text-sm font-semibold text-(--text-main)">
                      {bestMonth.month} - {formatCurrency(bestMonth.income)}
                    </p>
                  </div>
                )}
                <div className="rounded-2xl border border-(--border-subtle) bg-white/3 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                    Avg monthly spend
                  </p>
                  <p className="mt-2 text-sm font-semibold text-(--text-main)">
                    {formatCurrency(avgMonthlySpend)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-(--border-subtle) p-5 text-sm text-(--text-dim)">
              Add a few expense transactions to surface concentration analysis.
            </div>
          )}
        </BentoCard>

        <BentoCard colSpan="col-4" accent="blue" animDelay={560} className="flex flex-col">
          <header className="mb-6">
            <h2 className="font-display text-xl font-black tracking-tight text-(--text-main)">
              Monthly flow
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
              Compare inflow and outflow month by month
            </p>
          </header>
          <div className="flex-1 min-h-65">
            <MonthlyBarChart data={byMonth} />
          </div>
        </BentoCard>

        <BentoCard colSpan="col-8" accent="none" animDelay={640}>
          <RecentTransactions transactions={transactions} />
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
