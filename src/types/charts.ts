export interface ChartTooltipEntry<TData> {
  color?: string;
  fill?: string;
  name?: string;
  value?: number | string | ReadonlyArray<number | string>;
  payload: TData;
}

export interface ChartTooltipProps<TData> {
  active?: boolean;
  label?: number | string;
  payload?: ChartTooltipEntry<TData>[];
}
