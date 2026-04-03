import { Compass, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-6">
      <section className="glass relative w-full max-w-3xl overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-blue/14 blur-3xl" />
        <div className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 rounded-full bg-pink/16 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-[var(--border-subtle)] bg-white/[0.04] text-blue">
            <Compass size={24} />
          </div>

          <div>
            <p className="page-hero-kicker">404 error</p>
            <h1 className="page-hero-title max-w-2xl">This page is off the map.</h1>
            <p className="page-hero-copy max-w-2xl">
              The route you opened does not exist in this workspace, or it may have been moved
              during the UI cleanup.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="btn-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <MoveLeft size={16} />
              Back to dashboard
            </Link>
            <Link
              to="/insights"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-subtle)] px-5 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-white/[0.04] hover:text-[var(--text-main)]"
            >
              Open insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
