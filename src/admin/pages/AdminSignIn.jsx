import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminSignIn = () => {
  const { login, error } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [localError, setLocalError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setLocalError(null);
    try {
      await login(formState.email, formState.password);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mb-2 text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Frame Vist Admin</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-mist">Sign in to continue</p>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</span>
          <input
            type="email"
            name="email"
            required
            value={formState.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-indigo-500"
            autoFocus
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Password</span>
          <input
            type="password"
            name="password"
            required
            value={formState.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-ink outline-none transition focus:border-indigo-500"
          />
        </label>
        {(localError || error) && (
          <p className="text-sm text-rose-500 text-center">
            {localError || error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-800 px-6 py-3 text-base font-semibold uppercase tracking-[0.2em] text-white shadow hover:bg-slate-900 transition disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default AdminSignIn;
