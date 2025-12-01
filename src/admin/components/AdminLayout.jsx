import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGauge, FaPalette, FaCirclePlus, FaTags, FaChartBar, FaStore, FaBars } from 'react-icons/fa6';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <FaGauge className="w-5 h-5" /> },
  { label: 'Capsules', to: '/admin/capsules', icon: <FaPalette className="w-5 h-5" /> },
  { label: 'Add Capsule', to: '/admin/capsules/new', icon: <FaCirclePlus className="w-5 h-5" /> },
  { label: 'Promos', to: '/admin/promos', icon: <FaTags className="w-5 h-5" /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <FaChartBar className="w-5 h-5" /> },
];

const getAdminPageTitle = (pathname = '') => {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/capsules') return 'Capsules';
  if (pathname === '/admin/capsules/new') return 'Add Capsule';
  if (pathname.startsWith('/admin/capsules/') && pathname.endsWith('/edit')) return 'Edit Capsule';
  if (pathname.startsWith('/admin/capsules')) return 'Capsules';
  if (pathname.startsWith('/admin/promos')) return 'Promos';
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
    `flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-150 ${
      isActive
        ? 'bg-slate-900 text-white shadow scale-[1.04] border-b-2 border-slate-700'
        : 'text-slate-700 hover:bg-slate-100 hover:text-black'
    }`;

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar for Desktop */}
      <nav className="hidden lg:flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-8 py-3 shadow-md mb-8 sticky top-0 z-40">
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.3em] text-mist">Frame Vist</span>
          <h2 className="font-display text-xl text-ink leading-tight">Admin</h2>
        </div>
        <div className="flex items-center gap-6">
          {/* Primary actions */}
          <div className="flex items-center gap-4">
            {navItems.slice(0,3).map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClasses} end={item.to === '/admin'}>
                {item.icon && <span className="w-4 h-4 mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          {/* Divider */}
          <span className="mx-2 h-6 w-px bg-slate-200" />
          {/* Secondary actions */}
          <div className="flex items-center gap-4">
            {navItems.slice(3,5).map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClasses} end={item.to === '/admin'}>
                {item.icon && <span className="w-4 h-4 mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            title="View the storefront as a customer"
          >
            <FaStore className="w-4 h-4" />
            <span>Storefront</span>
            <span className="ml-1">↗</span>
          </a>
          <span className="text-xs font-mono tracking-[0.1em] text-slate-400">{user?.email}</span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-rose-700 transition"
            style={{boxShadow: '0 2px 12px rgba(244,63,94,0.10)'}}
          >
            <span>Sign out</span>
          </button>
        </div>
      </nav>
      <div className="mx-auto flex max-w-7xl gap-8 px-2 py-4 sm:px-6 lg:px-12 lg:py-10">
        <div className="flex-1">
           {/* Mobile header and menu */}
           <div className="flex items-center justify-between w-full lg:hidden mb-2">
             <div className="flex items-center gap-2">
               <button
                 type="button"
                 className="inline-flex items-center justify-center rounded-full bg-slate-800 p-2 text-white shadow-lg hover:bg-slate-700 transition"
                 onClick={() => setSidebarOpen((open) => !open)}
                 aria-label="Open menu"
               >
                 <FaBars className="w-6 h-6" />
               </button>
               <span className="font-display text-lg text-ink">Admin</span>
             </div>
             <button
               type="button"
               onClick={logout}
               className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
               style={{boxShadow: '0 2px 12px rgba(244,63,94,0.10)'}}
             >
               <span>Sign out</span>
             </button>
           </div>
           {/* Mobile drawer navigation */}
           {sidebarOpen && (
             <div className="fixed inset-0 z-50 flex lg:hidden">
               <div className="w-64 flex-shrink-0 flex flex-col gap-8 rounded-r-2xl border-r border-slate-200 bg-white p-7 shadow-md">
                 <div className="mb-2">
                   <span className="text-xs uppercase tracking-[0.4em] text-mist">Frame Vist</span>
                   <h2 className="mt-2 font-display text-2xl text-ink">Admin</h2>
                   <span className="mt-3 text-xs font-mono tracking-[0.2em] text-slate-400">{user?.email}</span>
                 </div>
                 <nav className="flex flex-col gap-2 mt-4">
                   {navItems.map((item) => (
                     <NavLink key={item.to} to={item.to} className={linkClasses} end={item.to === '/admin'} onClick={() => setSidebarOpen(false)}>
                       {item.icon}
                       <span>{item.label}</span>
                     </NavLink>
                   ))}
                   <a
                     href="/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-3 rounded-lg px-4 py-2 text-base font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-100 hover:text-ink"
                     title="View the storefront as a customer"
                   >
                     <FaStore className="w-5 h-5" />
                     <span>Storefront</span>
                     <span className="ml-1">↗</span>
                   </a>
                   <button
                     type="button"
                     onClick={logout}
                     className="mt-6 flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-base font-semibold text-white shadow hover:bg-rose-700 transition"
                     style={{boxShadow: '0 2px 12px rgba(244,63,94,0.10)'}}
                   >
                     <span>Sign out</span>
                   </button>
                 </nav>
               </div>
               <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
             </div>
           )}
           <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-10 mt-2">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
