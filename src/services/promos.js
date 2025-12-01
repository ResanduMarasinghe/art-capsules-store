import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { normalizeCode } from '../data/promoCodes';

const promosRef = collection(db, 'promoCodes');

const mapTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value.toDate) {
    const dateValue = value.toDate();
    return dateValue.toISOString();
  }
  return null;
};

const mapPromoSnapshot = (snapshot) =>
  snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      code: normalizeCode(data.code || docSnap.id),
      minimumSubtotal: Number(data.minimumSubtotal ?? 0),
      minimumOrderTotal:
        data.minimumOrderTotal !== undefined && data.minimumOrderTotal !== null
          ? Number(data.minimumOrderTotal)
          : null,
      expiresAt: mapTimestamp(data.expiresAt),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
    };
  });

const sanitizePromoPayload = (input = {}) => {
  const normalizedCode = normalizeCode(input.code);
  if (!normalizedCode) {
    throw new Error('Promo code is required.');
  }

  const type = input.type === 'flat' ? 'flat' : 'percentage';
  const value = Math.max(0, Number(input.value) || 0);
  const minimumSubtotal = Math.max(0, Number(input.minimumSubtotal) || 0);
  const minimumOrderTotal = input.minimumOrderTotal !== undefined && input.minimumOrderTotal !== ''
    ? Math.max(0, Number(input.minimumOrderTotal) || 0)
    : null;
  const maxDiscount = input.maxDiscount !== undefined && input.maxDiscount !== null
    ? Math.max(0, Number(input.maxDiscount) || 0)
    : null;

  let expiresAt = null;
  if (input.expiresAt) {
    const dateValue = new Date(input.expiresAt);
    expiresAt = Number.isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
  }

  return {
    code: normalizedCode,
    label: input.label?.trim() || normalizedCode,
    type,
    value,
    minimumSubtotal,
    minimumOrderTotal,
    description: input.description?.trim() || '',
    maxDiscount,
    expiresAt,
  };
};

export const fetchPromos = async () => {
  const promosQuery = query(promosRef, orderBy('code', 'asc'));
  const snapshot = await getDocs(promosQuery);
  return mapPromoSnapshot(snapshot);
};

export const upsertPromoCode = async (promo) => {
  const payload = sanitizePromoPayload(promo);
  const docRef = doc(promosRef, payload.code);
  const existing = await getDoc(docRef);
  const timestamp = serverTimestamp();

  await setDoc(
    docRef,
    {
      ...payload,
      createdAt: existing.exists() ? existing.data()?.createdAt || timestamp : timestamp,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  return payload.code;
};

export const deletePromoCode = async (code) => {
  const normalizedCode = normalizeCode(code);
  if (!normalizedCode) return;
  const docRef = doc(promosRef, normalizedCode);
  await deleteDoc(docRef);
};
