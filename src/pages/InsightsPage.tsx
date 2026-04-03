import {
  AlertTriangle,
  Calendar,
  Landmark,
  TrendingDown,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CATEGORY_COLORS } from '../constants/categories';
import { CategoryBreakdownTooltip } from '../components/shared/CategoryBreakdownTooltip';
import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import type { ChartTooltipProps } from '../types/charts';
import type { MonthlyData } from '../types';
import { SHARED_DONUT_PIE_PROPS } from '../utils/donutMotion';
import { formatCurrency } from '../utils';

interface MonthDiagnostics extends MonthlyData {
  expenseLoad: number;
  savings: number;
  savingsRate: number;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Landmark;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="glass p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
            {label}
          </p>
          <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-(--text-main)">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-(--text-muted)">{detail}</p>
        </div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border-subtle) bg-white/4">
          <Icon size={18} className="text-(--text-main)" />
        </div>
      </div>
    </div>
  );
}

function MonthlyTooltip({ active, payload, label }: ChartTooltipProps<MonthDiagnostics>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass min-w-45 rounded-2xl border border-(--border-subtle) bg-surface2 p-4 shadow-elite">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--text-dim)">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="mb-2 flex items-center justify-between gap-6 last:mb-0">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color || entry.fill, boxShadow: `0 0 12px ${entry.color || entry.fill}` }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">
              {entry.name}
            </span>
          </div>
          <span className="font-mono text-[13px] font-semibold tracking-tight text-(--text-main)">
            {typeof entry.value === 'number'
              ? entry.name?.toString().toLowerCase().includes('rate')
                ? `${entry.value.toFixed(1)}%`
                : formatCurrency(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InsightsPage() {
  const {
    avgMonthlySpend,
    bestMonth,
    biggestExpense,
    byCategory,
    byMonth,
  } = useDerivedFinancials();

  const monthlyDiagnostics: MonthDiagnostics[] = byMonth.map((month) => {
    const savings = month.income - month.expenses;
    const savingsRate = month.income > 0 ? (savings / month.income) * 100 : 0;
    const expenseLoad = month.income > 0 ? (month.expenses / month.income) * 100 : 0;

    return {
      ...month,
      savings,
      savingsRate,
      expenseLoad,
    };
  });

  const latestMonth = monthlyDiagnostics[monthlyDiagnostics.length - 1];
  const previousMonth = monthlyDiagnostics[monthlyDiagnostics.length - 2];
  const latestSavingsRate = latestMonth?.savingsRate ?? 0;
  const savingsRateDelta = previousMonth ? latestSavingsRate - previousMonth.savingsRate : 0;

  const rankedCategories = byCategory.slice(0, 6).map((item) => ({
    ...item,
    shortLabel: item.category.length > 16 ? `${item.category.slice(0, 13)}...` : item.category,
  }));

  const pieData = byCategory.slice(0, 5);
  const dominantCategory = rankedCategories[0];

  const observations = [
    {
      title: 'Savings discipline',
      detail:
        latestSavingsRate >= 20
          ? `Latest savings rate is ${latestSavingsRate.toFixed(1)}%, above the 20% benchmark.`
          : `Latest savings rate is ${latestSavingsRate.toFixed(1)}%, below the 20% benchmark.`,
      tone: latestSavingsRate >= 20 ? 'good' : 'warning',
    },
    {
      title: 'Category concentration',
      detail: dominantCategory
        ? `${dominantCategory.category} represents ${dominantCategory.percent.toFixed(1)}% of expense outflow.`
        : 'Add expense data to assess concentration risk.',
      tone: dominantCategory && dominantCategory.percent > 28 ? 'warning' : 'neutral',
    },
    {
      title: 'Largest single expense',
      detail: biggestExpense
        ? `${biggestExpense.description} at ${formatCurrency(biggestExpense.amount)}.`
        : 'No expense transactions available yet.',
      tone: 'neutral',
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <header className="glass page-hero">
        <div className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-blue/16 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-pink/14 blur-3xl" />
        <div className="page-hero-content max-w-3xl">
          <p className="page-hero-kicker">Insights</p>
          <h1 className="page-hero-title">Trend diagnostics and spending signals</h1>
          <p className="page-hero-copy max-w-3xl">
            Read multi-month performance, savings efficiency, and category concentration from
            charts that are built for analysis rather than decoration.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Landmark}
          label="Latest savings rate"
          value={`${latestSavingsRate.toFixed(1)}%`}
          detail={previousMonth ? `${savingsRateDelta >= 0 ? '+' : ''}${savingsRateDelta.toFixed(1)} pts vs previous month` : 'Waiting for comparison month'}
        />
        <MetricCard
          icon={Calendar}
          label="Best income month"
          value={bestMonth ? bestMonth.month : 'N/A'}
          detail={bestMonth ? formatCurrency(bestMonth.income) : 'No income data yet'}
        />
        <MetricCard
          icon={TrendingDown}
          label="Average monthly spend"
          value={formatCurrency(avgMonthlySpend)}
          detail="Average of the most recent three months"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Largest single expense"
          value={biggestExpense ? formatCurrency(biggestExpense.amount) : 'N/A'}
          detail={biggestExpense ? biggestExpense.description : 'No expense transactions yet'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="glass xl:col-span-8 p-6 sm:p-8">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-tight text-(--text-main)">
              Income, expenses, and balance
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Monthly comparison for total movement and closing position
            </p>
          </header>

          <div className="chart-shell h-85 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyDiagnostics} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="insightIncomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="insightExpenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity={0.64} />
                  </linearGradient>
                  <linearGradient id="insightBalanceStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="insightLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ec4899" floodOpacity="0.26" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                  tickFormatter={(value: number) => formatCurrency(value)}
                  width={72}
                />
                <Tooltip content={<MonthlyTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 18, fontSize: 12 }}
                  formatter={(value: string) => (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="url(#insightIncomeFill)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                  activeBar={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.25, filter: 'url(#insightLineGlow)' }}
                  isAnimationActive
                  animationDuration={1450}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="url(#insightExpenseFill)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                  activeBar={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.25, filter: 'url(#insightLineGlow)' }}
                  isAnimationActive
                  animationDuration={1450}
                  animationBegin={180}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="url(#insightBalanceStroke)"
                  strokeWidth={3.5}
                  dot={false}
                  activeDot={{ r: 7, fill: '#ffffff', stroke: '#ec4899', strokeWidth: 2, filter: 'url(#insightLineGlow)' }}
                  isAnimationActive
                  animationDuration={1550}
                  animationBegin={280}
                  animationEasing="ease-out"
                  filter="url(#insightLineGlow)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass xl:col-span-4 p-6 sm:p-8">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-tight text-(--text-main)">
              Savings rate trend
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Track efficiency against a 20% benchmark
            </p>
          </header>

          <div className="chart-shell h-85 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDiagnostics} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsRateStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="savingsRateGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ec4899" floodOpacity="0.28" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                  tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                  width={52}
                />
                <ReferenceLine
                  y={20}
                  stroke="#60a5fa"
                  strokeDasharray="5 5"
                  label={{ value: '20% target', position: 'insideTopRight', fill: '#60a5fa', fontSize: 11 }}
                />
                <Tooltip content={<MonthlyTooltip />} />
                <Line
                  type="monotone"
                  dataKey="savingsRate"
                  name="Savings rate"
                  stroke="url(#savingsRateStroke)"
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 7, fill: '#ffffff', stroke: '#ec4899', strokeWidth: 2, filter: 'url(#savingsRateGlow)' }}
                  isAnimationActive
                  animationDuration={1550}
                  animationEasing="ease-out"
                  filter="url(#savingsRateGlow)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="glass xl:col-span-7 p-6 sm:p-8">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-tight text-(--text-main)">
              Category concentration
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Rank categories by share of total expense outflow
            </p>
          </header>

          <div className="chart-shell h-80 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankedCategories} layout="vertical" margin={{ top: 0, right: 18, left: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                  tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                  width={120}
                />
                <Tooltip content={<CategoryBreakdownTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
                <Bar
                  dataKey="percent"
                  radius={[0, 10, 10, 0]}
                  activeBar={{ stroke: 'rgba(255,255,255,0.28)', strokeWidth: 1.1 }}
                  isAnimationActive
                  animationDuration={1450}
                  animationEasing="ease-out"
                >
                  {rankedCategories.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass xl:col-span-5 p-6 sm:p-8">
          <header className="mb-6">
            <h2 className="font-display text-2xl font-black tracking-tight text-(--text-main)">
              Expense mix
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
              Top categories contributing to expense volume
            </p>
          </header>

          <div className="chart-shell h-80 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="insightSliceGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ec4899" floodOpacity="0.18" />
                  </filter>
                </defs>
                <Pie
                  data={pieData}
                  dataKey="amount"
                  nameKey="category"
                  {...SHARED_DONUT_PIE_PROPS}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} filter="url(#insightSliceGlow)" />
                  ))}
                </Pie>
                <Tooltip content={<CategoryBreakdownTooltip motion="donut" />} cursor={{ fill: 'transparent' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {dominantCategory && (
            <div className="rounded-2xl border border-(--border-subtle) bg-white/3 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
                Dominant category
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className=" font-semibold text-(--text-main)">
                    {dominantCategory.category}
                  </p>
                  <p className="mt-1 text-sm text-(--text-muted)">
                    {formatCurrency(dominantCategory.amount)} of tracked expense outflow
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1.5 text-sm font-semibold"
                  style={{ background: `${CATEGORY_COLORS[dominantCategory.category]}16`, color: dominantCategory.color }}
                >
                  {dominantCategory.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {observations.map((item) => (
          <div key={item.title} className="glass p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-dim)">
                Analyst note
              </p>
              <span
                className={[
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
                  item.tone === 'good'
                    ? 'bg-green/10 text-green'
                    : item.tone === 'warning'
                      ? 'bg-amber/10 text-amber'
                      : 'bg-blue/10 text-blue',
                ].join(' ')}
              >
                {item.tone}
              </span>
            </div>
            <h3 className="font-display text-xl font-black tracking-tight text-(--text-main)">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-(--text-muted)">{item.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
