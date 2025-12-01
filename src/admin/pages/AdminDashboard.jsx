import React, { useEffect, useMemo, useState } from 'react';
import OrdersModal from '../components/OrdersModal';
import { FaDollarSign, FaReceipt, FaCube } from 'react-icons/fa6';
// import { fetchOrders } from '../../services/orders';
// import { fetchCollectorEmails } from '../../services/collectors';

// import { useEffect, useMemo, useState } from 'react';
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
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const latestCollectors = collectorEmails.slice(0, 8);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatDate = (date) =>
    date instanceof Date ? date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Section */}
      <div className="space-y-2 sm:space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Overview</p>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Frame Vist Operations</h1>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaDollarSign className="w-5 h-5 text-emerald-500" />
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Total Revenue</p>
          </div>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">{formatCurrency(stats.revenue || 0)}</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">aura capsules sold</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaReceipt className="w-5 h-5 text-indigo-500" />
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Orders</p>
          </div>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">{stats.orders}</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">lifetime frames curated</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaCube className="w-5 h-5 text-pink-500" />
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Pieces sold</p>
          </div>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">{stats.pieces}</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">individual capsules delivered</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Recent orders</p>
            <h2 className="font-display text-xl text-ink sm:text-2xl">Collector activity</h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow hover:bg-black transition disabled:opacity-50"
            onClick={() => setOrdersModalOpen(true)}
            disabled={orders.length === 0}
          >
            View all orders
          </button>
        </div>
        {/* Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading orders…</p>
          ) : recentOrders.length ? (
            recentOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-ink">{order.customerName || 'Collector'}</p>
                    {order.customerEmail ? (
                      <p className="text-xs text-slate-400">{order.customerEmail}</p>
                    ) : null}
                    <p className="font-mono text-[0.65rem] tracking-[0.2em] text-slate-500">{order.id}</p>
                  </div>
                  <p className="font-display text-xl text-ink">{formatCurrency(order.total || 0)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-600">
                    {order.items?.reduce((count, item) => count + (item.quantity || 0), 0) || 0} pieces
                  </span>
                  <span className="uppercase tracking-[0.3em] text-slate-400">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">No orders yet.</p>
          )}
        </div>
        {/* Desktop Table Layout */}
        <div className="hidden overflow-x-auto rounded-3xl border border-slate-100 bg-white/80 md:block">
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

      {/* Collector Emails Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Collector emails</p>
            <h2 className="font-display text-xl text-ink sm:text-2xl">Mailing list</h2>
          </div>
        </div>
        {/* Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading collector emails…</p>
          ) : latestCollectors.length ? (
            latestCollectors.map((collector) => (
              <div key={collector.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                <div className="space-y-2">
                  <p className="font-mono text-xs tracking-[0.2em] text-slate-500">{collector.email}</p>
                  <p className="text-sm text-slate-600">{collector.name || '—'}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[0.65rem]">
                    <span className="text-slate-400">Order: {collector.orderId || '—'}</span>
                    <span className="uppercase tracking-[0.3em] text-slate-400">{formatDate(collector.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">No collector emails captured yet.</p>
          )}
        </div>
        {/* Desktop Table Layout */}
        <div className="hidden overflow-x-auto rounded-3xl border border-slate-100 bg-white/80 md:block">
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
    {/* Orders Modal Overlay */}
    <OrdersModal open={ordersModalOpen} orders={orders} onClose={() => setOrdersModalOpen(false)} />
  </div>
);
};

export default AdminDashboard;
