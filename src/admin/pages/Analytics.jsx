import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FaChartLine, 
  FaDollarSign, 
  FaCartShopping, 
  FaEye, 
  FaTag,
  FaTrophy,
  FaArrowTrendUp
} from 'react-icons/fa6';
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
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FaChartLine className="h-6 w-6 animate-pulse text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <FaChartLine className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Error loading analytics</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <FaChartLine className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500">Track performance and insights</p>
            </div>
          </div>
          {period !== TIME_PERIODS.ALL && (
            <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              <span className="font-medium">Note:</span> Views and cart metrics for filtered periods are estimated based on purchase data.
            </div>
          )}
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                period === p.value
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
              <FaDollarSign className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {formatCurrency(analytics.summary.totalRevenue)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {analytics.summary.totalOrders} orders
          </p>
        </div>

        <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
              <FaCartShopping className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Avg Order Value</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {formatCurrency(analytics.summary.avgOrderValue)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            per transaction
          </p>
        </div>

        <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
              <FaArrowTrendUp className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Conversion Rate</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {formatPercent(analytics.summary.overallConversionRate)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            views → purchases
          </p>
        </div>

        <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform group-hover:scale-110">
              <FaEye className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Total Views</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {analytics.summary.totalViews.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            across all capsules
          </p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      {analytics.revenueTrend.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FaChartLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Revenue Trend</h2>
                <p className="text-sm text-slate-500">Daily revenue over time</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={analytics.revenueTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3} />
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
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Conversion Funnel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <FaEye className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Step 1</span>
          </div>
          <p className="text-sm font-medium text-slate-500">View → Cart</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatPercent(analytics.summary.viewToCartRate)}
          </p>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(analytics.summary.viewToCartRate, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {analytics.summary.totalAddedToCart.toLocaleString()} added to cart
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FaCartShopping className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Step 2</span>
          </div>
          <p className="text-sm font-medium text-slate-500">Cart → Purchase</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatPercent(analytics.summary.cartToPurchaseRate)}
          </p>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${Math.min(analytics.summary.cartToPurchaseRate, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {analytics.summary.totalPurchases.toLocaleString()} purchases made
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <FaArrowTrendUp className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Overall</span>
          </div>
          <p className="text-sm font-medium text-slate-500">Overall Conversion</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatPercent(analytics.summary.overallConversionRate)}
          </p>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
              style={{ width: `${Math.min(analytics.summary.overallConversionRate, 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            from {analytics.summary.totalViews.toLocaleString()} total views
          </p>
        </div>
      </div>

      {/* Top Products by Revenue */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <FaTrophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top Performers</h2>
              <p className="text-sm text-slate-500">Highest revenue capsules</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {analytics.topByRevenue.slice(0, 5).map((capsule, index) => (
            <div 
              key={capsule.id} 
              className="group flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                index === 0 ? 'bg-amber-100 text-amber-600' :
                index === 1 ? 'bg-slate-200 text-slate-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {index + 1}
              </div>
              {capsule.image && (
                <img 
                  src={capsule.image} 
                  alt={capsule.title} 
                  className="h-14 w-14 flex-shrink-0 rounded-lg object-cover ring-1 ring-slate-200" 
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{capsule.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{capsule.artist}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-bold text-slate-900">{formatCurrency(capsule.revenue)}</p>
                <p className="mt-0.5 text-sm text-slate-500">{capsule.purchases} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tags */}
      {analytics.topTags.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <FaTag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tag Performance</h2>
                <p className="text-sm text-slate-500">Most profitable tags</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
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
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
