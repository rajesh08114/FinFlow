import type { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  accent?: 'blue' | 'violet' | 'cyan' | 'rose' | 'amber' | 'green' | 'pink' | 'none';
  animate?: boolean;
  animDelay?: number;
  noPad?: boolean;
  style?: React.CSSProperties;
}

const accentBorderMap: Record<string, string> = {
  blue:   'border-l-[3px] border-l-blue',
  violet: 'border-l-[3px] border-l-violet',
  cyan:   'border-l-[3px] border-l-cyan',
  rose:   'border-l-[3px] border-l-rose',
  amber:  'border-l-[3px] border-l-amber',
  green:  'border-l-[3px] border-l-green',
  pink:   'border-l-[3px] border-l-pink',
  none:   '',
};

const colSpanMap: Record<string, string> = {
  'col-3': 'col-span-1 md:col-span-3 xl:col-span-3',
  'col-4': 'col-span-1 md:col-span-3 xl:col-span-4',
  'col-5': 'col-span-1 md:col-span-3 xl:col-span-5',
  'col-6': 'col-span-1 md:col-span-6 xl:col-span-6',
  'col-7': 'col-span-1 md:col-span-6 xl:col-span-7',
  'col-8': 'col-span-1 md:col-span-6 xl:col-span-8',
  'col-12': 'col-span-1 md:col-span-6 xl:col-span-12',
};

const rowSpanMap: Record<string, string> = {
  'row-2': 'row-span-2',
  'row-3': 'row-span-3',
};

export function BentoCard({
  children,
  className = '',
  colSpan = 'col-3',
  rowSpan,
  accent = 'none',
  animate = true,
  animDelay = 0,
  noPad = false,
  style,
}: BentoCardProps) {
  const classes = [
    'glass',
    colSpanMap[colSpan] || 'col-span-3',
    rowSpan ? (rowSpanMap[rowSpan] || '') : '',
    accentBorderMap[accent],
    animate ? 'animate__animated animate__fadeInUp' : '',
    noPad ? '' : 'p-6',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ animationDelay: `${animDelay}ms`, ...style }}>
      {children}
    </div>
  );
}
