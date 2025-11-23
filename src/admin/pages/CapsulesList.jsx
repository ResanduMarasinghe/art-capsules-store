import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCapsule, fetchCapsules, setCapsulePublished } from '../../services/capsules';

const CapsulesList = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCapsules = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchCapsules();
      setCapsules(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this capsule?')) return;
    await deleteCapsule(id);
    loadCapsules();
  };

  const handleToggle = async (capsule) => {
    await setCapsulePublished(capsule.id, !capsule.published);
    loadCapsules();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Capsules</p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Catalogue manager</h1>
        </div>
        <Link
          to="/admin/capsules/new"
          className="rounded-full border border-ink px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink hover:bg-ink hover:text-white sm:px-6 sm:py-3 sm:text-xs"
        >
          + New Capsule
        </Link>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">Loading capsules…</p>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {capsules.map((capsule) => (
              <div key={capsule.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <div className="flex gap-3">
                  {capsule.mainImage && (
                    <img
                      src={capsule.mainImage}
                      alt={capsule.title}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-semibold text-ink">{capsule.title}</p>
                      <p className="text-xs text-slate-400">{capsule.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg text-ink">
                        {capsule.price ? `$${Number(capsule.price).toFixed(2)}` : '—'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(capsule)}
                        className={`rounded-full px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] transition ${
                          capsule.published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {capsule.published ? 'Live' : 'Draft'}
                      </button>
                    </div>
                    {capsule.tags?.length ? (
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                        {capsule.tags.slice(0, 2).join(' · ')}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <Link
                    to={`/admin/capsules/${capsule.id}/edit`}
                    className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-xs uppercase tracking-[0.3em] text-slate-600"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(capsule.id)}
                    className="flex-1 rounded-full border border-rose-200 px-4 py-2 text-xs uppercase tracking-[0.3em] text-rose-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <th className="px-4 py-3">Capsule</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {capsules.map((capsule) => (
                <tr key={capsule.id} className="align-top">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {capsule.mainImage && (
                        <img
                          src={capsule.mainImage}
                          alt={capsule.title}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-ink">{capsule.title}</p>
                        {capsule.tags?.length ? (
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            {capsule.tags.slice(0, 3).join(' · ')}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs tracking-[0.2em] text-slate-500">
                    {capsule.id}
                  </td>
                  <td className="px-4 py-4 font-display text-lg text-ink">
                    {capsule.price ? `$${Number(capsule.price).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(capsule)}
                      className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                        capsule.published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {capsule.published ? 'Live' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/capsules/${capsule.id}/edit`}
                        className="rounded-full border border-slate-200 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-600"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(capsule.id)}
                        className="rounded-full border border-rose-200 px-4 py-1 text-xs uppercase tracking-[0.3em] text-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
};

export default CapsulesList;
