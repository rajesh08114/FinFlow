import type { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid w-full grid-cols-1 gap-5 md:grid-cols-6 xl:grid-cols-12 ${className}`}>
      {children}
    </div>
  );
}
