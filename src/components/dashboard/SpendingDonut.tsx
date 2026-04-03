import { Package } from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CategoryBreakdown } from '../../types';
import { SHARED_DONUT_PIE_PROPS } from '../../utils/donutMotion';
import { CategoryBreakdownTooltip } from '../shared/CategoryBreakdownTooltip';

function CustomLegend({ items }: { items: CategoryBreakdown[] }) {
  return (
    <div className="grid gap-3 sm:ml-2">
      {items.map((entry) => (
        <div key={entry.category} className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: entry.color, boxShadow: `0 0 10px ${entry.color}44` }}
          />
          <span className="flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {entry.category}
          </span>
          <span className="font-mono text-[11px] font-semibold text-[var(--text-dim)]">
            {entry.percent.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function SpendingDonut({ data }: { data: CategoryBreakdown[] }) {
  const top5 = data.slice(0, 5);

  if (!top5.length) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center gap-3 text-[var(--text-dim)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-[var(--border-subtle)]">
          <Package size={18} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
          Add transactions to see category mix
        </span>
      </div>
    );
  }

  return (
    <div className="chart-shell relative isolate p-3">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_148px] sm:items-center">
        <div className="h-[220px] sm:h-[252px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="sliceGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ec4899" floodOpacity="0.18" />
                </filter>
              </defs>
              <Pie
                data={top5}
                dataKey="amount"
                nameKey="category"
                {...SHARED_DONUT_PIE_PROPS}
              >
                {top5.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} filter="url(#sliceGlow)" />
                ))}
              </Pie>
              <Tooltip content={<CategoryBreakdownTooltip motion="donut" />} cursor={{ fill: 'transparent' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend items={top5} />
      </div>
    </div>
  );
}
