import { fetchCapsules } from './capsules';
import { fetchOrders } from './orders';

const TIME_PERIODS = {
  ALL: 'all',
  DAYS_7: '7d',
  DAYS_30: '30d',
  DAYS_90: '90d',
};

const filterByTimePeriod = (items, period, dateField = 'createdAt') => {
  if (period === TIME_PERIODS.ALL) return items;
  
  const now = new Date();
  const daysAgo = period === TIME_PERIODS.DAYS_7 ? 7 : period === TIME_PERIODS.DAYS_30 ? 30 : 90;
  const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  
  return items.filter((item) => {
    const itemDate = item[dateField];
    if (!itemDate) return false;
    const date = itemDate instanceof Date ? itemDate : itemDate.toDate?.() || new Date(itemDate);
    return date >= cutoffDate;
  });
};

export const getAnalytics = async (period = TIME_PERIODS.ALL) => {
  try {
    const [capsules, orders] = await Promise.all([
      fetchCapsules(),
      fetchOrders(),
    ]);

    const filteredOrders = filterByTimePeriod(orders, period);

    // Revenue metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Capsule performance
    const capsuleRevenue = {};
    const capsulePurchases = {};
    
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const id = item.id;
        capsuleRevenue[id] = (capsuleRevenue[id] || 0) + (item.price * item.quantity);
        capsulePurchases[id] = (capsulePurchases[id] || 0) + item.quantity;
      });
    });

    // Top products by revenue
    const topByRevenue = Object.entries(capsuleRevenue)
      .map(([id, revenue]) => {
        const capsule = capsules.find((c) => c.id === id);
        return {
          id,
          title: capsule?.title || 'Unknown',
          artist: capsule?.artist || 'Unknown',
          revenue,
          purchases: capsulePurchases[id] || 0,
          image: capsule?.mainImage || capsule?.image,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top products by purchases
    const topByPurchases = Object.entries(capsulePurchases)
      .map(([id, purchases]) => {
        const capsule = capsules.find((c) => c.id === id);
        return {
          id,
          title: capsule?.title || 'Unknown',
          artist: capsule?.artist || 'Unknown',
          purchases,
          revenue: capsuleRevenue[id] || 0,
          image: capsule?.mainImage || capsule?.image,
        };
      })
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 10);

    // Conversion metrics
    // For "ALL" time period, use cumulative stats from capsules
    // For filtered periods, derive estimates from order data
    let totalViews, totalAddedToCart, totalPurchases;
    
    if (period === TIME_PERIODS.ALL) {
      // Use cumulative stats for all-time metrics
      totalViews = capsules.reduce((sum, cap) => sum + (cap.stats?.views || 0), 0);
      totalAddedToCart = capsules.reduce((sum, cap) => sum + (cap.stats?.addedToCart || 0), 0);
      totalPurchases = capsules.reduce((sum, cap) => sum + (cap.stats?.purchases || 0), 0);
    } else {
      // For time-filtered periods, derive from filtered orders
      // Count total items purchased in the period
      totalPurchases = filteredOrders.reduce((sum, order) => 
        sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) || 0), 0);
      
      // Estimate cart additions as 1.5x purchases (typical 33% cart abandonment rate)
      totalAddedToCart = Math.round(totalPurchases * 1.5);
      
      // Estimate views as 5x cart additions (typical 20% add-to-cart rate)
      totalViews = totalAddedToCart * 5;
    }
    
    const viewToCartRate = totalViews > 0 ? (totalAddedToCart / totalViews) * 100 : 0;
    const cartToPurchaseRate = totalAddedToCart > 0 ? (totalPurchases / totalAddedToCart) * 100 : 0;
    const overallConversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;

    // Revenue over time (daily for last 30 days, or group by week for longer periods)
    const revenueByDate = {};
    filteredOrders.forEach((order) => {
      const date = order.createdAt instanceof Date ? order.createdAt : order.createdAt?.toDate?.() || new Date(order.createdAt);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + (order.total || 0);
    });

    const revenueTrend = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Tag performance
    const tagStats = {};
    
    if (period === TIME_PERIODS.ALL) {
      // For all-time, use cumulative stats
      capsules.forEach((capsule) => {
        capsule.tags?.forEach((tag) => {
          if (!tagStats[tag]) {
            tagStats[tag] = { views: 0, purchases: 0, revenue: 0 };
          }
          tagStats[tag].views += capsule.stats?.views || 0;
          tagStats[tag].purchases += capsule.stats?.purchases || 0;
          tagStats[tag].revenue += capsuleRevenue[capsule.id] || 0;
        });
      });
    } else {
      // For filtered periods, only use data from filtered orders
      filteredOrders.forEach((order) => {
        order.items?.forEach((item) => {
          const capsule = capsules.find((c) => c.id === item.id);
          capsule?.tags?.forEach((tag) => {
            if (!tagStats[tag]) {
              tagStats[tag] = { views: 0, purchases: 0, revenue: 0 };
            }
            tagStats[tag].purchases += item.quantity || 1;
            tagStats[tag].revenue += item.price * (item.quantity || 1);
          });
        });
      });
      
      // Estimate views based on purchases (using same 5x ratio)
      Object.values(tagStats).forEach((stats) => {
        stats.views = stats.purchases * 5;
      });
    }

    const topTags = Object.entries(tagStats)
      .map(([tag, stats]) => ({
        tag,
        ...stats,
        conversionRate: stats.views > 0 ? (stats.purchases / stats.views) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalViews,
        totalAddedToCart,
        totalPurchases,
        viewToCartRate,
        cartToPurchaseRate,
        overallConversionRate,
      },
      topByRevenue,
      topByPurchases,
      topTags,
      revenueTrend,
      period,
    };
  } catch (error) {
    console.error('Analytics error:', error);
    throw new Error('Failed to load analytics data');
  }
};

export { TIME_PERIODS };
