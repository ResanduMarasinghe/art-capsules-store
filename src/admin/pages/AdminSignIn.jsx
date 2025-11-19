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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pearl via-white to-pearl px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-2xl backdrop-blur"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-mist">Frame Vist</p>
          <h1 className="mt-2 font-display text-2xl text-ink">Admin Access</h1>
          <p className="mt-3 text-sm text-slate-500">
            Sign in with your curated admin credentials to manage capsules.
          </p>
        </div>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Email</span>
          <input
            type="email"
            name="email"
            required
            value={formState.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Password</span>
          <input
            type="password"
            name="password"
            required
            value={formState.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
          />
        </label>
        {(localError || error) && (
          <p className="text-sm text-rose-500">
            {localError || error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-ink/90 disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing in…' : 'Enter Admin'}
        </button>
      </form>
    </div>
  );
};

export default AdminSignIn;
