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

const ordersRef = collection(db, 'orders');

const mapSnapshot = (snapshot) =>
  snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
    };
  });

export const createOrder = async (data) => {
  const payload = {
    ...data,
    status: data.status || 'completed',
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(ordersRef, payload);
  return docRef.id;
};

export const fetchOrders = async (take = 100) => {
  const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(take));
  const snapshot = await getDocs(ordersQuery);
  return mapSnapshot(snapshot);
};

export const fetchRecentOrders = async (take = 6) => {
  return fetchOrders(take);
};
