import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Capsules', to: '/admin/capsules' },
  { label: 'Add Capsule', to: '/admin/capsules/new' },
  { label: 'Analytics', to: '/admin/analytics' },
];

const getAdminPageTitle = (pathname = '') => {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/capsules') return 'Capsules';
  if (pathname === '/admin/capsules/new') return 'Add Capsule';
  if (pathname.startsWith('/admin/capsules/') && pathname.endsWith('/edit')) return 'Edit Capsule';
  if (pathname.startsWith('/admin/capsules')) return 'Capsules';
  if (pathname.startsWith('/admin/analytics')) return 'Analytics';
  return 'Admin';
};

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const pageTitle = getAdminPageTitle(location.pathname);

  useEffect(() => {
    document.title = `Frame Vist Admin — ${pageTitle}`;
  }, [pageTitle]);

  const linkClasses = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition ${
      isActive ? 'bg-ink text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl via-white to-pearl">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 lg:px-12">
        <aside className="hidden w-64 flex-shrink-0 flex-col gap-6 rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-mist">Frame Vist</p>
            <h2 className="mt-2 font-display text-2xl text-ink">Admin</h2>
            <p className="mt-3 text-xs uppercase tracking-[0.35em] text-slate-400">
              {user?.email}
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClasses} end={item.to === '/admin'}>
                {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:bg-white/50"
              title="View the storefront as a customer"
            >
              View Storefront ↗
            </a>
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-auto rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-ink"
          >
            Sign out
          </button>
        </aside>
        <div className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/40 bg-white/90 px-4 py-4 shadow-sm backdrop-blur lg:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-mist">Frame Vist</p>
              <h2 className="font-display text-xl text-ink">Admin</h2>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-600"
            >
              Sign out
            </button>
          </header>
          <div className="mb-6 grid gap-3 rounded-3xl border border-white/40 bg-white/90 p-3 text-center backdrop-blur lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClasses} end={item.to === '/admin'}>
                {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:bg-white/50"
              title="View the storefront as a customer"
            >
              View Storefront ↗
            </a>
          </div>
          <main className="rounded-3xl border border-white/40 bg-white/95 p-6 shadow-sm backdrop-blur lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
