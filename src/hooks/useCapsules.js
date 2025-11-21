import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { fetchTags } from '../services/tags';

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
  const [tags, setTags] = useState(['all']);
  const [hasLoadedTags, setHasLoadedTags] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDocs(capsulesRef);
        const docs = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              aspectRatioValue: getAspectRatioValue(data.aspectRatio),
            };
          })
          .filter((capsule) => capsule.published !== false);
        setCapsules(docs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadTags = async () => {
      try {
        const loaded = await fetchTags();
        if (cancelled) return;
        const unique = Array.from(new Set(loaded.filter(Boolean)));
        setTags(['all', ...unique]);
        setHasLoadedTags(true);
      } catch (err) {
        if (!cancelled) {
          console.warn('Unable to load tag catalogue', err);
        }
      }
    };
    loadTags();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hasLoadedTags) return;
    if (!capsules.length) return;
    const unique = new Set();
    capsules.forEach((capsule) => {
      capsule.tags?.forEach((tag) => {
        if (tag) unique.add(tag);
      });
    });
    if (!unique.size) return;
    setTags(['all', ...Array.from(unique)]);
  }, [capsules, hasLoadedTags]);

  return { capsules, loading, error, tags };
};
