import { Fragment, createElement } from 'react';
import { Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts';

export const SHARED_DONUT_PIE_PROPS = {
  activeShape: donutActiveShape,
  cx: '50%',
  cy: '50%',
  innerRadius: '48%',
  outerRadius: '74%',
  paddingAngle: 4,
  strokeWidth: 0,
  isAnimationActive: true,
  animationDuration: 1550,
  animationEasing: 'ease-out' as const,
};

function donutActiveShape(props: PieSectorDataItem) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = '#3b82f6',
  } = props;

  const inner = Number(innerRadius);
  const outer = Number(outerRadius);

  return createElement(
    Fragment,
    null,
    createElement(Sector, {
      cx,
      cy,
      innerRadius: inner,
      outerRadius: outer + 8,
      startAngle,
      endAngle,
      fill,
      opacity: 0.95,
    }),
    createElement(Sector, {
      cx,
      cy,
      innerRadius: outer + 11,
      outerRadius: outer + 15,
      startAngle,
      endAngle,
      fill,
      opacity: 0.22,
    })
  );
}
