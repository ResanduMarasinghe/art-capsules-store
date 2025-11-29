const promoCodes = [
  {
    code: 'ARTDROP20',
    label: 'Holiday Drop — 20% off',
    type: 'percentage',
    value: 20,
    expiresAt: '2025-12-31T23:59:59.000Z',
    minimumSubtotal: 80,
    description: 'Limited holiday pricing on orders over $80.',
  },
  {
    code: 'FRAME10',
    label: 'Studio Loyalty — $10 off',
    type: 'flat',
    value: 10,
    expiresAt: '2025-06-30T23:59:59.000Z',
    minimumSubtotal: 60,
    description: 'Save $10 when collecting two or more capsules.',
  },
  {
    code: 'COLLECT5',
    label: 'Collector Circle — 5% off',
    type: 'percentage',
    value: 5,
    expiresAt: null,
    minimumSubtotal: 0,
    description: 'Evergreen perk for newsletter collectors.',
  },
];

const normalizeCode = (code = '') => code.trim().toUpperCase();

export const findPromoCode = (code = '') => {
  const normalized = normalizeCode(code);
  return promoCodes.find((entry) => entry.code === normalized) || null;
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

export const validatePromoCode = (code, subtotal) => {
  const promo = findPromoCode(code);
  if (!promo) {
    return { valid: false, reason: 'not-found' };
  }

  if (isPromoExpired(promo)) {
    return { valid: false, reason: 'expired', promo };
  }

  if (promo.minimumSubtotal && subtotal < promo.minimumSubtotal) {
    return { valid: false, reason: 'minimum', promo };
  }

  const discount = calculateDiscountAmount(promo, subtotal);
  if (!discount) {
    return { valid: false, reason: 'ineligible', promo };
  }

  return { valid: true, promo, discount };
};

export default promoCodes;
