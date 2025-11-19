import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const safeSlug = (value, fallback = 'capsule') =>
  ((value || fallback)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48)) || fallback;

const getExtensionFromUrl = (url = '') => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]{2,6})$/);
    return match ? match[1] : 'jpg';
  } catch (error) {
    return 'jpg';
  }
};

const fetchAssetBuffer = async (url) => {
  if (!url) return null;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download asset: ${url}`);
  }
  return response.arrayBuffer();
};

const addAsset = (assets, url, pathGenerator) => {
  if (!url) return;
  assets.push({ url, pathGenerator });
};

const buildMetadata = (item) => {
  const { quantity, ...rest } = item;
  return JSON.stringify(
    { ...rest, quantity, generatedAt: new Date().toISOString() },
    null,
    2
  );
};

export const downloadCapsuleBundle = async (order) => {
  if (!order?.items?.length) return;
  const zip = new JSZip();

  const tasks = order.items.map(async (item, index) => {
    const folderName = `${index + 1}-${safeSlug(item.title || item.id)}`;
    const folder = zip.folder(folderName);
    if (!folder) return;

    folder.file('metadata.json', buildMetadata(item));

    const assets = [];
    addAsset(assets, item.mainImage || item.image, (ext) => `primary.${ext}`);
    item.gallery?.forEach((url, idx) => {
      addAsset(assets, url, (ext) => `gallery/gallery-${idx + 1}.${ext}`);
    });
    item.variations?.forEach((url, idx) => {
      addAsset(assets, url, (ext) => `variations/variation-${idx + 1}.${ext}`);
    });
    if (item.resolutions) {
      Object.entries(item.resolutions).forEach(([label, url]) => {
        addAsset(assets, url, (ext) => `resolutions/${safeSlug(label, 'resolution')}.${ext}`);
      });
    }

    for (const asset of assets) {
      try {
        const buffer = await fetchAssetBuffer(asset.url);
        if (!buffer) continue;
        const ext = getExtensionFromUrl(asset.url);
        const path = asset.pathGenerator(ext);
        folder.file(path, buffer);
      } catch (error) {
        console.warn('Skipping asset download due to error', asset.url, error);
      }
    }
  });

  await Promise.all(tasks);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `frame-vist-order-${order.id || Date.now()}.zip`;
  saveAs(zipBlob, filename);
};
