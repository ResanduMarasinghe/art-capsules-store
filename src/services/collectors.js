import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const collectorsRef = collection(db, 'collectorEmails');

const normalizeEmail = (email) => email?.trim().toLowerCase() || '';

const mapSnapshot = (snapshot) =>
  snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
    };
  }); // https://github.com/ResanduMarasinghe

export const recordCollectorEmail = async ({ email, name, orderId }) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const payload = {
    email: normalizedEmail,
    name: name?.trim() || '',
    orderId: orderId || null,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collectorsRef, payload);
  return docRef.id;
};

export const fetchCollectorEmails = async (take = 50) => {
  const collectorsQuery = query(collectorsRef, orderBy('createdAt', 'desc'), limit(take));
  const snapshot = await getDocs(collectorsQuery);
  return mapSnapshot(snapshot);
};
