import type { Theme } from '../types';

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.toggle('light', theme === 'light');
  root.classList.toggle('dark', theme === 'dark');
}
