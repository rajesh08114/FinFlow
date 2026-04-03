import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const startRef   = useRef<number | null>(null);
  const startVal   = useRef(0);
  const rafRef     = useRef<number>(0);
  const prevTarget = useRef(target);
  const valueRef   = useRef(0);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    startVal.current = prevTarget.current !== target ? valueRef.current : 0;
    prevTarget.current = target;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setValue(startVal.current + (target - startVal.current) * easedProgress);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
