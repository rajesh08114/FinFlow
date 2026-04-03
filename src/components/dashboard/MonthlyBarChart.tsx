import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartTooltipProps } from '../../types/charts';
import type { MonthlyData } from '../../types';
import { formatCurrency } from '../../utils';

function CustomTooltip({ active, payload, label }: ChartTooltipProps<MonthlyData>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass min-w-[160px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface2)] p-4 shadow-elite">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)]">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="mb-2 flex items-center justify-between gap-6 last:mb-0">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.fill === 'url(#monthlyIncomeFill)' ? '#3b82f6' : '#ec4899' }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {entry.name}
            </span>
          </div>
          <span className="font-mono text-[13px] font-semibold tracking-tight text-[var(--text-main)]">
            {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  const last6 = data.slice(-6);

  return (
    <div className="chart-shell h-full min-h-[220px] p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={last6} margin={{ top: 18, right: 0, left: 0, bottom: 0 }} barGap={8}>
          <defs>
            <linearGradient id="monthlyIncomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.58} />
            </linearGradient>
            <linearGradient id="monthlyExpenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.58} />
            </linearGradient>
            <filter id="barGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#ec4899" floodOpacity="0.25" />
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
            width={66}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
          <Bar
            dataKey="income"
            name="Income"
            fill="url(#monthlyIncomeFill)"
            radius={[8, 8, 0, 0]}
            maxBarSize={28}
            activeBar={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.25, filter: 'url(#barGlow)' }}
            isAnimationActive
            animationDuration={1450}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="url(#monthlyExpenseFill)"
            radius={[8, 8, 0, 0]}
            maxBarSize={28}
            activeBar={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.25, filter: 'url(#barGlow)' }}
            isAnimationActive
            animationDuration={1450}
            animationBegin={180}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
