import type { LucideIcon } from 'lucide-react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { MonthlyData } from '../../types';
import { formatCurrency } from '../../utils';
import { useCountUp } from '../../hooks/useCountUp';

interface KpiCardProps {
  title: string;
  value: number;
  trend?: number;
  accent?: 'cyan' | 'green' | 'rose' | 'violet' | 'blue' | 'amber' | 'pink';
  icon: LucideIcon;
  animDelay?: number;
  subtitle?: string;
  data?: MonthlyData[];
  dataKey?: keyof MonthlyData;
}

type Accent = NonNullable<KpiCardProps['accent']>;

const accentColorMap: Record<Accent, { border: string; hex: string; surface: string }> = {
  cyan: { border: 'border-l-cyan', hex: '#06b6d4', surface: 'bg-cyan/10' },
  green: { border: 'border-l-green', hex: '#10b981', surface: 'bg-green/10' },
  rose: { border: 'border-l-rose', hex: '#f43f5e', surface: 'bg-rose/10' },
  violet: { border: 'border-l-violet', hex: '#8b5cf6', surface: 'bg-violet/10' },
  blue: { border: 'border-l-blue', hex: '#3b82f6', surface: 'bg-blue/10' },
  amber: { border: 'border-l-amber', hex: '#f59e0b', surface: 'bg-amber/10' },
  pink: { border: 'border-l-pink', hex: '#ec4899', surface: 'bg-pink/10' },
};

export function KpiCard({
  title,
  value,
  trend,
  accent = 'blue',
  icon: Icon,
  animDelay = 0,
  subtitle,
  data,
  dataKey,
}: KpiCardProps) {
  const animated = useCountUp(value);
  const cfg = accentColorMap[accent];

  const TrendIcon = trend === undefined || Math.abs(trend) < 0.5
    ? Minus
    : trend > 0
      ? TrendingUp
      : TrendingDown;

  const trendClass = trend === undefined || Math.abs(trend) < 0.5
    ? 'text-[var(--text-dim)]'
    : trend > 0
      ? 'text-green'
      : 'text-rose';

  return (
    <div
      className={`glass group col-span-1 md:col-span-3 xl:col-span-3 border-l-4 ${cfg.border} relative flex min-h-[176px] flex-col gap-5 p-6 animate__animated animate__fadeInUp`}
      style={{ animationDelay: `${animDelay}ms`, background: 'var(--color-card)' }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-80 blur-3xl"
        style={{ background: `${cfg.hex}20` }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-dim)]">
            {title}
          </p>
          <h3 className="mt-4 font-mono text-[30px] font-medium leading-none tracking-tight text-[var(--text-main)]">
            {formatCurrency(animated)}
          </h3>
        </div>
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-subtle)] ${cfg.surface}`}>
          <Icon size={18} className="text-[var(--text-main)]" />
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {trend !== undefined && (
          <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trend > 0 ? 'bg-green/10' : trend < 0 ? 'bg-rose/10' : 'bg-white/[0.05]'}`}>
            <TrendIcon size={12} className={trendClass} />
            <span className={trendClass}>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
        <span className="text-xs font-medium text-[var(--text-dim)]">
          {subtitle || (trend !== undefined ? 'vs previous month' : '')}
        </span>
      </div>

      {data && dataKey && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id={`kpiSpark-${accent}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={cfg.hex} stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={`url(#kpiSpark-${accent})`}
                strokeWidth={3}
                dot={false}
                isAnimationActive
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
