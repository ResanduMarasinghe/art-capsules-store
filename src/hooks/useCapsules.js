import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const capsulesRef = collection(db, 'capsules');

const getAspectRatioValue = (aspectRatio) => {
  if (!aspectRatio || typeof aspectRatio !== 'string') return '1 / 1';
  const [rawWidth, rawHeight] = aspectRatio.split(':').map(Number);
  if (!rawWidth || !rawHeight) return '1 / 1';
  return `${rawWidth} / ${rawHeight}`;
};

export const useCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDocs(capsulesRef);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            aspectRatioValue: getAspectRatioValue(data.aspectRatio),
          };
        });
        setCapsules(docs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tags = useMemo(() => {
    const unique = new Set();
    capsules.forEach((capsule) => {
      capsule.tags?.forEach((tag) => unique.add(tag));
    });
    return ['all', ...Array.from(unique)];
  }, [capsules]);

  return { capsules, loading, error, tags };
};
