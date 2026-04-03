import { useFinanceStore } from '../store/useFinanceStore';
import type { Action } from '../types';

export function useRole() {
  const role   = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const can    = useFinanceStore((s) => s.can);

  return {
    role,
    setRole,
    isAdmin:  role === 'admin',
    isViewer: role === 'viewer',
    can: (action: Action) => can(action),
  };
}
