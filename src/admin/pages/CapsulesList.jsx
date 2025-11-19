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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Capsules</p>
          <h1 className="font-display text-3xl text-ink">Catalogue manager</h1>
        </div>
        <Link
          to="/admin/capsules/new"
          className="rounded-full border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-ink hover:bg-ink hover:text-white"
        >
          + New Capsule
        </Link>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">Loading capsules…</p>
      ) : (
        <div className="overflow-x-auto">
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
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{capsule.mood}</p>
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
      )}
    </div>
  );
};

export default CapsulesList;
