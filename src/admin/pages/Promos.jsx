import { useEffect, useMemo, useState } from 'react';
import { deletePromoCode, fetchPromos, upsertPromoCode } from '../../services/promos';

const initialFormState = {
  code: '',
  label: '',
  type: 'percentage',
  value: 10,
  minimumSubtotal: 0,
  minimumOrderTotal: '',
  description: '',
  maxDiscount: '',
  expiresAt: '',
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const Promos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState(() => ({ ...initialFormState }));
  const [formFeedback, setFormFeedback] = useState(null);

  const sortedPromos = useMemo(() => {
    return [...promos].sort((a, b) => a.code.localeCompare(b.code));
  }, [promos]);

  const loadPromos = async () => {
    setLoading(true);
    try {
    const results = await fetchPromos();
    setPromos(results || []);
      setError(null);
    } catch (err) {
      const friendlyMessage =
        err?.code === 'permission-denied'
          ? 'Missing or insufficient permissions to view promo codes. Contact the project owner to grant admin access to the promoCodes collection.'
          : err.message || 'Unable to load promo codes.';
      setError(friendlyMessage);
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormFeedback(null);
    if (!formValues.code.trim()) {
      setFormFeedback({ type: 'error', message: 'Promo code is required.' });
      return;
    }
    setSaving(true);
    try {
    await upsertPromoCode(formValues);
    setFormFeedback({ type: 'success', message: `${formValues.code.toUpperCase()} saved successfully.` });
    setFormValues({ ...initialFormState });
      await loadPromos();
    } catch (err) {
      const friendlyMessage =
        err?.code === 'permission-denied'
          ? 'Unable to save — this account lacks permission to manage promo codes.'
          : err.message || 'Unable to save promo.';
      setFormFeedback({ type: 'error', message: friendlyMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Remove promo code ${code}?`)) return;
    try {
      await deletePromoCode(code);
      await loadPromos();
    } catch (err) {
      const friendlyMessage =
        err?.code === 'permission-denied'
          ? 'Unable to delete — missing permission to modify promo codes.'
          : err.message || 'Unable to delete promo code.';
      setError(friendlyMessage);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist">Promotions</p>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Promo codes</h1>
        <p className="text-sm text-slate-500">
          Create, update, or retire promotional offers. Codes sync automatically to the storefront checkout.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <section className="space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-mist">Active codes</p>
              <h2 className="font-display text-xl text-ink">Library</h2>
            </div>
            <button
              type="button"
              onClick={loadPromos}
              className="rounded-full border border-slate-200 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-slate-600 transition hover:border-ink"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading promos…</p>
          ) : (
            <div className="space-y-3">
              {sortedPromos.map((promo) => {
                const expiryDate = promo.expiresAt ? new Date(promo.expiresAt) : null;
                const hasExpiry = expiryDate && !Number.isNaN(expiryDate.getTime());
                return (
                  <article
                    key={promo.code}
                    className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-inner"
                  >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-mist">{promo.code}</p>
                      <h3 className="font-display text-lg text-ink">{promo.label}</h3>
                      <p className="text-sm text-slate-500">{promo.description || '—'}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-right text-sm text-slate-600">
                      <span>
                        {promo.type === 'percentage'
                          ? `${promo.value}% off`
                          : `${formatCurrency(promo.value)} off`}
                      </span>
                      <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                        Min ${Number(promo.minimumSubtotal || 0).toFixed(2)}
                      </span>
                      {promo.minimumOrderTotal ? (
                        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                          Total ${Number(promo.minimumOrderTotal).toFixed(2)}+
                        </span>
                      ) : null}
                      {hasExpiry && (
                        <span className="text-xs text-rose-500">
                          Expires {expiryDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                    {promo.maxDiscount ? (
                      <span>Max discount {formatCurrency(promo.maxDiscount)}</span>
                    ) : (
                      <span>No cap</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(promo.code)}
                      className="text-rose-500 transition hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                  </article>
                );
              })}
              {!sortedPromos.length && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  <p className="font-medium text-slate-600">No promo codes yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Create your first code in the form on the right to unlock launch promos.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white/80 p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-mist">Configure</p>
          <h2 className="font-display text-xl text-ink">Add / Update promo</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-mist">Promo code</label>
              <input
                name="code"
                value={formValues.code}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase tracking-[0.35em] outline-none focus:border-ink"
                placeholder="FRAMEVIST2025"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.35em] text-mist">Label</label>
              <input
                name="label"
                value={formValues.label}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                placeholder="Anniversary drop"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Type</label>
                <select
                  name="type"
                  value={formValues.type}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat amount</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Value</label>
                <input
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.value}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Minimum subtotal</label>
                <input
                  name="minimumSubtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.minimumSubtotal}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Minimum order total (incl. tax)</label>
                <input
                  name="minimumOrderTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.minimumOrderTotal}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="50"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Max discount (optional)</label>
                <input
                  name="maxDiscount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.maxDiscount}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="100"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Expires at</label>
                <input
                  name="expiresAt"
                  type="date"
                  value={formValues.expiresAt}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.35em] text-mist">Description</label>
                <input
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  placeholder="Copy describing the promo"
                />
              </div>
            </div>
            {formFeedback && (
              <p
                className={`text-xs ${
                  formFeedback.type === 'error' ? 'text-rose-500' : 'text-emerald-600'
                }`}
              >
                {formFeedback.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save promo'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Promos;
