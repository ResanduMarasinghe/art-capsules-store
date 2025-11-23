import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { syncTagUsage } from './tags.js';

const capsulesRef = collection(db, 'capsules');
const capsuleCounterRef = doc(db, 'metadata', 'capsulesCounter');
const defaultStats = { views: 0, addedToCart: 0, purchases: 0 };

const formatCapsuleId = (sequence) => `cap_${String(sequence).padStart(4, '0')}`;

const getNextCapsuleId = async () =>
  runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(capsuleCounterRef);
    const currentValue = snapshot.exists() ? snapshot.data().nextValue || 1 : 1;
    transaction.set(
      capsuleCounterRef,
      {
        nextValue: currentValue + 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return formatCapsuleId(currentValue);
  });

export const fetchCapsules = async () => {
  const snapshot = await getDocs(capsulesRef);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
};

export const fetchCapsuleById = async (id) => {
  const documentRef = doc(db, 'capsules', id);
  const snapshot = await getDoc(documentRef);
  if (!snapshot.exists()) {
    throw new Error('Capsule not found');
  }
  return { id: snapshot.id, ...snapshot.data() };
};

export const createCapsule = async (data) => {
  const capsuleId = await getNextCapsuleId();
  const documentRef = doc(db, 'capsules', capsuleId);

  const payload = {
    ...data,
    stats: data.stats || defaultStats,
    published: typeof data.published === 'boolean' ? data.published : false,
    createdAt: serverTimestamp(),
  };

  await setDoc(documentRef, payload);
  await syncTagUsage([], payload.tags || []);
  return capsuleId;
};

export const updateCapsule = async (id, data) => {
  const documentRef = doc(db, 'capsules', id);
  const snapshot = await getDoc(documentRef);
  if (!snapshot.exists()) {
    throw new Error('Capsule not found');
  }
  const previousTags = snapshot.data()?.tags || [];
  await updateDoc(documentRef, {
    ...data,
    stats: data.stats || defaultStats,
    updatedAt: serverTimestamp(),
  });
  await syncTagUsage(previousTags, data.tags || []);
};

export const deleteCapsule = async (id) => {
  const documentRef = doc(db, 'capsules', id);
  const snapshot = await getDoc(documentRef);
  const previousTags = snapshot.exists() ? snapshot.data()?.tags || [] : [];
  await deleteDoc(documentRef);
  if (previousTags.length) {
    await syncTagUsage(previousTags, []);
  }
};

export const setCapsulePublished = async (id, published) => {
  const documentRef = doc(db, 'capsules', id);
  await updateDoc(documentRef, { published });
};

export const recordCapsuleView = async (id) => {
  if (!id) return;
  const documentRef = doc(db, 'capsules', id);
  await updateDoc(documentRef, {
    'stats.views': increment(1),
  });
};

export const recordCapsuleAddedToCart = async (id, quantity = 1) => {
  if (!id) return;
  const documentRef = doc(db, 'capsules', id);
  await updateDoc(documentRef, {
    'stats.addedToCart': increment(quantity),
  });
};

export const recordCapsulePurchase = async (id, quantity = 1) => {
  if (!id) return;
  const documentRef = doc(db, 'capsules', id);
  await updateDoc(documentRef, {
    'stats.purchases': increment(quantity),
  });
};
