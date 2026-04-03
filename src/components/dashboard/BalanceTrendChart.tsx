import {
  Area,
  AreaChart,
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
    <div className="glass min-w-[168px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface2)] p-4 shadow-elite">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)]">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="mb-2 flex items-center justify-between gap-6 last:mb-0">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color, boxShadow: `0 0 12px ${entry.color}` }}
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

export function BalanceTrendChart({ data }: { data: MonthlyData[] }) {
  const last6 = data.slice(-6);

  return (
    <div className="chart-shell h-full min-h-[250px] p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last6} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dashboardIncomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.34} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dashboardExpenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f472b6" stopOpacity={0.26} />
              <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dashboardBalanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dashboardBalanceStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="balanceGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="hoverDotGlow" x="-200%" y="-200%" width="400%" height="400%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ec4899" floodOpacity="0.45" />
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
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#60a5fa"
            strokeWidth={2.75}
            fill="url(#dashboardIncomeFill)"
            dot={false}
            isAnimationActive
            animationDuration={1500}
            animationEasing="ease-out"
            activeDot={{ r: 5, fill: '#60a5fa', stroke: '#08111f', strokeWidth: 2, filter: 'url(#hoverDotGlow)' }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#f472b6"
            strokeWidth={2.75}
            fill="url(#dashboardExpenseFill)"
            dot={false}
            isAnimationActive
            animationDuration={1500}
            animationBegin={160}
            animationEasing="ease-out"
            activeDot={{ r: 5, fill: '#f472b6', stroke: '#08111f', strokeWidth: 2, filter: 'url(#hoverDotGlow)' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="url(#dashboardBalanceStroke)"
            strokeWidth={3.5}
            fill="url(#dashboardBalanceFill)"
            dot={false}
            activeDot={{ r: 7, fill: '#ffffff', stroke: '#ec4899', strokeWidth: 2, filter: 'url(#hoverDotGlow)' }}
            isAnimationActive
            animationDuration={1650}
            animationBegin={300}
            animationEasing="ease-out"
            filter="url(#balanceGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
