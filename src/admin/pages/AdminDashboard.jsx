import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../../services/orders';
import { fetchCollectorEmails } from '../../services/collectors';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [collectorEmails, setCollectorEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersResults, collectorsResults] = await Promise.all([
          fetchOrders(),
          fetchCollectorEmails(),
        ]);
        setOrders(ordersResults);
        setCollectorEmails(collectorsResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const totalPieces = orders.reduce((acc, order) => {
      const orderPieces = order.items?.reduce((count, item) => count + (item.quantity || 0), 0) || 0;
      return acc + orderPieces;
    }, 0);
    return {
      revenue: totalRevenue,
      orders: orders.length,
      pieces: totalPieces,
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const latestCollectors = collectorEmails.slice(0, 8);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatDate = (date) =>
    date instanceof Date ? date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Overview</p>
        <h1 className="font-display text-3xl text-ink">Frame Vist Operations</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Monitor capsules, review drop performance, and keep the collection curated. Use the sidebar to
          add new capsules, adjust pricing, or review analytics.
        </p>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-inner">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total Revenue</p>
          <p className="mt-4 font-display text-4xl text-ink">{formatCurrency(stats.revenue || 0)}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">aura capsules sold</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-inner">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Orders</p>
          <p className="mt-4 font-display text-4xl text-ink">{stats.orders}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">lifetime frames curated</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-inner">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Pieces sold</p>
          <p className="mt-4 font-display text-4xl text-ink">{stats.pieces}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">individual capsules delivered</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-mist">Recent orders</p>
            <h2 className="font-display text-2xl text-ink">Collector activity</h2>
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white/80">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Collector</th>
                <th className="px-4 py-3">Pieces</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    Loading orders…
                  </td>
                </tr>
              ) : recentOrders.length ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 font-mono text-xs tracking-[0.2em] text-slate-500">{order.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-ink">{order.customerName || 'Collector'}</p>
                      {order.customerEmail ? (
                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {order.items?.reduce((count, item) => count + (item.quantity || 0), 0) || 0}
                    </td>
                    <td className="px-4 py-4 font-display text-lg text-ink">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="px-4 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-mist">Collector emails</p>
            <h2 className="font-display text-2xl text-ink">Mailing list</h2>
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white/80">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Last Order</th>
                <th className="px-4 py-3">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    Loading collector emails…
                  </td>
                </tr>
              ) : latestCollectors.length ? (
                latestCollectors.map((collector) => (
                  <tr key={collector.id}>
                    <td className="px-4 py-4 font-mono text-xs tracking-[0.2em] text-slate-500">
                      {collector.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {collector.name || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {collector.orderId || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {formatDate(collector.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No collector emails captured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
