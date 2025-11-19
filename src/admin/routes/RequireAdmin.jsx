import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSignIn from '../pages/AdminSignIn';

const RequireAdmin = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pearl">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Loading admin...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminSignIn />;
  }

  return <Outlet />;
};

export default RequireAdmin;
