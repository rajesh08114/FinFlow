import { useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { InsightsPage } from './pages/InsightsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { useFinanceStore } from './store/useFinanceStore';
import { applyTheme } from './utils/theme';

export default function App() {
  const theme = useFinanceStore((s) => s.theme);

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
