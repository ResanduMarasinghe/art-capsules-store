export const defaultPromoCodes = [];

export const normalizeCode = (code = '') => code.trim().toUpperCase();

const resolvePromoPool = (pool) => (Array.isArray(pool) && pool.length ? pool : defaultPromoCodes);

export const findPromoCode = (code = '', pool = defaultPromoCodes) => {
  const normalized = normalizeCode(code);
  return resolvePromoPool(pool).find((entry) => entry.code === normalized) || null;
};

export const isPromoExpired = (promo) => {
  if (!promo?.expiresAt) return false;
  return Date.now() > new Date(promo.expiresAt).getTime();
};

export const calculateDiscountAmount = (promo, subtotal) => {
  if (!promo || subtotal <= 0) return 0;
  const amount =
    promo.type === 'percentage'
      ? (subtotal * (promo.value / 100))
      : promo.value;
  const maxDiscount = promo.maxDiscount || subtotal;
  return Math.max(0, Math.min(amount, maxDiscount, subtotal));
};

export const validatePromoCode = (code, subtotal, pool = defaultPromoCodes, context = {}) => {
  const promo = findPromoCode(code, pool);
  if (!promo) {
    return { valid: false, reason: 'not-found' };
  }

  if (isPromoExpired(promo)) {
    return { valid: false, reason: 'expired', promo };
  }

  if (promo.minimumSubtotal && subtotal < promo.minimumSubtotal) {
    return { valid: false, reason: 'minimum', promo };
  }

  const orderTotal = typeof context.orderTotal === 'number' ? context.orderTotal : subtotal;
  if (promo.minimumOrderTotal && orderTotal < promo.minimumOrderTotal) {
    return { valid: false, reason: 'minimum-total', promo };
  }

  const discount = calculateDiscountAmount(promo, subtotal);
  if (!discount) {
    return { valid: false, reason: 'ineligible', promo };
  }

  return { valid: true, promo, discount };
};

export default defaultPromoCodes;
