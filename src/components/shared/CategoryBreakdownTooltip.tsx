import type { ChartTooltipProps } from '../../types/charts';
import type { CategoryBreakdown } from '../../types';
import { formatCurrency } from '../../utils';

interface CategoryBreakdownTooltipProps extends ChartTooltipProps<CategoryBreakdown> {
  motion?: 'default' | 'donut';
}

export function CategoryBreakdownTooltip({
  active,
  payload,
  motion = 'default',
}: CategoryBreakdownTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const isDonut = motion === 'donut';

  return (
    <div
      className={[
        'glass rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface2)] shadow-elite',
        isDonut ? 'donut-tooltip w-[168px] px-3.5 py-3' : 'chart-tooltip min-w-[176px] p-4',
      ].join(' ')}
    >
      <p className={`font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)] ${isDonut ? 'mb-2 text-[9px]' : 'mb-3 text-[10px]'}`}>
        Expense category
      </p>
      <div className={`flex items-center justify-between ${isDonut ? 'mb-1.5 gap-3' : 'mb-2 gap-6'}`}>
        <div className={`min-w-0 flex items-center ${isDonut ? 'gap-2' : 'gap-2.5'}`}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: item.color, boxShadow: `0 0 12px ${item.color}` }}
          />
          <span className={`truncate font-semibold uppercase tracking-wide text-[var(--text-muted)] ${isDonut ? 'text-[10px]' : 'text-[11px]'}`}>
            {item.category}
          </span>
        </div>
        <span className={`shrink-0 font-mono font-semibold tracking-tight text-[var(--text-main)] ${isDonut ? 'text-[12px]' : 'text-[13px]'}`}>
          {formatCurrency(item.amount)}
        </span>
      </div>
      <div className={`flex items-center justify-between ${isDonut ? 'gap-3' : 'gap-6'}`}>
        <div className={`min-w-0 flex items-center ${isDonut ? 'gap-2' : 'gap-2.5'}`}>
          <span className="h-2 w-2 rounded-full bg-pink shadow-[0_0_12px_rgba(236,72,153,0.5)]" />
          <span className={`font-semibold uppercase tracking-wide text-[var(--text-muted)] ${isDonut ? 'text-[10px]' : 'text-[11px]'}`}>
            Share
          </span>
        </div>
        <span className={`shrink-0 font-mono font-semibold tracking-tight text-[var(--text-main)] ${isDonut ? 'text-[12px]' : 'text-[13px]'}`}>
          {item.percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
