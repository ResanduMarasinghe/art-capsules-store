import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const tagsRef = collection(db, 'tags');

const formatTagLabel = (tag = '') => tag.trim();

const getTagId = (tag = '') =>
  formatTagLabel(tag)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tag';

export const fetchTags = async () => {
  const snapshot = await getDocs(tagsRef);
  return snapshot.docs
    .map((tagDoc) => tagDoc.data()?.label || tagDoc.id)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

const buildTagCounts = (tags = []) => {
  return tags
    .map(formatTagLabel)
    .filter(Boolean)
    .reduce((acc, tag) => {
      const key = tag;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
};

const updateTagDocument = async (tag, delta) => {
  if (!delta) return;
  const label = formatTagLabel(tag);
  if (!label) return;
  const tagId = getTagId(label);
  const tagDocRef = doc(tagsRef, tagId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(tagDocRef);
    const current = snapshot.exists() ? snapshot.data()?.usageCount || 0 : 0;
    const nextValue = current + delta;

    if (nextValue <= 0) {
      transaction.delete(tagDocRef);
      return;
    }

    const payload = {
      label,
      slug: tagId,
      usageCount: nextValue,
      updatedAt: serverTimestamp(),
    };

    if (!snapshot.exists()) {
      payload.createdAt = serverTimestamp();
    }

    transaction.set(tagDocRef, payload, { merge: true });
  });
};

export const syncTagUsage = async (previousTags = [], nextTags = []) => {
  const previous = buildTagCounts(previousTags);
  const next = buildTagCounts(nextTags);
  const tagNames = new Set([...Object.keys(previous), ...Object.keys(next)]);

  await Promise.all(
    Array.from(tagNames).map((tag) => updateTagDocument(tag, (next[tag] || 0) - (previous[tag] || 0)))
  );
};
