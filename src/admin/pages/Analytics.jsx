import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalytics, TIME_PERIODS } from '../../services/analytics';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(TIME_PERIODS.ALL);

  const loadAnalytics = async (selectedPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics(selectedPeriod);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(period);
  }, [period]);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatPercent = (value) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Analytics</p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Loading analytics…</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Analytics</p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Error loading analytics</h1>
          <p className="mt-2 text-sm text-rose-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Analytics</p>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Performance Insights</h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            Track revenue, conversions, and top-performing capsules across time periods.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All Time', value: TIME_PERIODS.ALL },
            { label: '7 Days', value: TIME_PERIODS.DAYS_7 },
            { label: '30 Days', value: TIME_PERIODS.DAYS_30 },
            { label: '90 Days', value: TIME_PERIODS.DAYS_90 },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                period === p.value
                  ? 'border-ink bg-ink text-white shadow-md'
                  : 'border-slate-200 text-slate-500 hover:border-ink/50 hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Revenue</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatCurrency(analytics.summary.totalRevenue)}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">
            {analytics.summary.totalOrders} orders
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Avg Order</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatCurrency(analytics.summary.avgOrderValue)}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">
            per transaction
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Conversion</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatPercent(analytics.summary.overallConversionRate)}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">
            views → purchases
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Total Views</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {analytics.summary.totalViews.toLocaleString()}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:mt-2 sm:text-xs">
            across all capsules
          </p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      {analytics.revenueTrend.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <div className="mb-4">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Revenue Trend</p>
            <h2 className="font-display text-xl text-ink sm:text-2xl">Daily Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.revenueTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0f172a" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Conversion Funnel */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">View → Cart</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatPercent(analytics.summary.viewToCartRate)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${analytics.summary.viewToCartRate}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Cart → Purchase</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatPercent(analytics.summary.cartToPurchaseRate)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${analytics.summary.cartToPurchaseRate}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Overall</p>
          <p className="mt-3 font-display text-3xl text-ink sm:mt-4 sm:text-4xl">
            {formatPercent(analytics.summary.overallConversionRate)}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-violet-500 transition-all duration-500"
              style={{ width: `${analytics.summary.overallConversionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Products by Revenue */}
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
        <div className="mb-4">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Top Performers</p>
          <h2 className="font-display text-xl text-ink sm:text-2xl">Highest Revenue Capsules</h2>
        </div>
        <div className="space-y-3">
          {analytics.topByRevenue.slice(0, 5).map((capsule, index) => (
            <div key={capsule.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/50 p-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 font-display text-sm text-ink">
                {index + 1}
              </span>
              {capsule.image && (
                <img src={capsule.image} alt={capsule.title} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-ink">{capsule.title}</p>
                <p className="text-xs text-slate-400">{capsule.artist}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-ink">{formatCurrency(capsule.revenue)}</p>
                <p className="text-xs text-slate-400">{capsule.purchases} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tags */}
      {analytics.topTags.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner sm:rounded-3xl sm:p-6">
          <div className="mb-4">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist sm:text-xs">Tag Performance</p>
            <h2 className="font-display text-xl text-ink sm:text-2xl">Most Profitable Tags</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topTags.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="tag" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                  if (name === 'conversionRate') return [formatPercent(value), 'Conversion'];
                  return [value, name];
                }}
              />
              <Bar dataKey="revenue" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
