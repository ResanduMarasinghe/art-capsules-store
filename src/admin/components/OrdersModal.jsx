import React from 'react';
import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';

const OrdersModal = ({ open, orders = [], onClose }) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-2 sm:px-0">
      {/* Overlay covers everything */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-label="Close orders modal"
      />
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-display text-xl sm:text-2xl text-ink">All Orders</h2>
          <button
            type="button"
            className="flex items-center justify-center rounded-full bg-rose-600 p-2 text-white shadow hover:bg-rose-700 transition"
            onClick={onClose}
            aria-label="Close"
            style={{ width: 36, height: 36 }}
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="text-center text-slate-500">No orders found.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Order</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Collector</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Pieces</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Total</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="px-2 py-2 sm:px-4 sm:py-4 font-mono tracking-[0.2em] text-slate-500 break-all">{order.id}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-4">
                      <p className="font-semibold text-ink">{order.customerName || 'Collector'}</p>
                      {order.customerEmail ? (
                        <p className="text-xs text-slate-400 break-all">{order.customerEmail}</p>
                      ) : null}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-4 text-slate-600">
                      {order.items?.reduce((count, item) => count + (item.quantity || 0), 0) || 0}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-4 font-display text-ink">
                      ${order.total?.toFixed(2) || '—'}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {order.createdAt instanceof Date ? order.createdAt.toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrdersModal;
