# Frame Vist Capsules

> A Firestore-powered digital art storefront with a fully featured admin console, instant-download checkout, and Cloudinary-backed creative pipeline.

- **Storefront** – responsive, bento-style capsule grid with search, tagging, cart, and immersive modals.
- **Checkout** – validates collector details, logs orders to Firestore, increments capsule analytics, and ships a curated ZIP instantly via JSZip + FileSaver.
- **Admin console** – gated by Firebase Auth with capsule CRUD, analytics, sequential ID generation, Cloudinary uploads, and collector email visibility.

This document captures every major capability, plus setup, data models, and troubleshooting guidance so you can run, extend, or audit the platform end-to-end.

## Feature matrix

### Storefront experience

| Capability             | Description                                                                                                         | Source of truth                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Bento capsule grid     | Responsive CSS grid that uses Firestore-provided `aspectRatio` metadata to auto-span cards and reduce whitespace    | `src/pages/Home.jsx`, `src/components/ProductCard.jsx`         |
| Search & tag filtering | Client-side filtering across title, artist, descriptions, and tagged moods                                          | `Home.jsx`                                                     |
| Capsule modal          | Full metadata (story, prompt, resolutions, gallery) with add-to-cart CTA                                            | `src/components/ProductModal.jsx`                              |
| Cart drawer            | Global cart context with persistent state per session                                                               | `src/context/CartContext.jsx`, `src/components/CartDrawer.jsx` |
| Publish controls       | Unpublished capsules (`published === false`) are filtered client-side to ensure work-in-progress pieces stay hidden | `src/hooks/useCapsules.js`                                     |

### Checkout & fulfillment

| Capability             | Description                                                                                           | Implementation                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Collector verification | Requires name + email and captures per-order notes                                                    | `src/pages/Checkout.jsx`                                |
| Firestore orders       | Persists `orders` documents with line items, totals, fulfillment status, and server timestamps        | `src/services/orders.js`                                |
| Collector mailing list | Mirrors every checkout email inside `collectorEmails` collection for admin outreach                   | `src/services/collectors.js`                            |
| Instant downloads      | Uses JSZip + FileSaver to build `frame-vist-order-<id>.zip` containing art assets and `metadata.json` | `src/services/downloads.js`                             |
| Analytics counters     | Each purchase increments capsule `stats.purchases` and global metadata totals                         | `src/services/capsules.js`, `src/services/analytics.js` |

### Admin console

| Capability             | Description                                                                                                                    | Files                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Firebase Auth gate     | Email/password login with loading states and friendly errors                                                                   | `src/admin/routes/RequireAdmin.jsx`, `src/admin/pages/AdminSignIn.jsx`, `src/context/AuthContext.jsx` |
| Capsule CRUD           | Form-driven create/update with validation, gallery inputs, tag management, resolution helpers, and auto aspect ratio detection | `src/admin/pages/CapsuleForm.jsx`, `src/admin/components/*`                                           |
| Cloudinary uploads     | Unsigned uploads per field (main image, gallery slots, variations) that immediately populate Firestore payloads                | `src/admin/components/ImageUploadButton.jsx`, `GalleryInput.jsx`                                      |
| Sequential capsule IDs | Transactions against `metadata/capsulesCounter` ensure predictable IDs like `cap_0007`                                         | `src/services/capsules.js`                                                                            |
| Published toggle       | Quickly hide/show capsules; storefront respects the flag                                                                       | `CapsuleForm.jsx`, `capsules.js`                                                                      |
| Analytics & collectors | Dashboard cards show views/carts/purchases, while collector table surfaces the latest emails                                   | `src/admin/pages/AdminDashboard.jsx`, `Analytics.jsx`                                                 |

### Data & infrastructure

| Area             | Details                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase         | Firestore for data, Auth for admin logins. Storage is optional—the project relies on Cloudinary for media but Firestore Storage rules remain in place for backwards compatibility. |
| Cloudinary       | Unsigned preset accepts uploads directly from the admin UI; responses populate image URLs stored in Firestore.                                                                     |
| Tailwind CSS     | Utility-first styling across storefront and admin, configured via `tailwind.config.js` + `postcss.config.js`.                                                                      |
| React Router DOM | Powers public vs admin routing, including guards and nested layouts.                                                                                                               |

## Architecture overview

1. **Data ingestion** – Admins create capsules via the console. Each document includes metadata (title, artist, story, prompt, gallery URLs, variations, resolutions array, aspect ratio, stats, and `published` flag).
2. **Catalogue fetch** – `useCapsules` loads the `capsules` collection, converts `aspectRatio` strings to CSS values, and filters out unpublished rows before exposing them to `Home`.
3. **Storefront UX** – Visitors browse the bento grid, open modals, and add items to the cart stored in context.
4. **Checkout** – Collectors provide contact info; the order service writes to Firestore, collector email is replicated, capsule stats increment, and the download service assembles the ZIP.
5. **Admin oversight** – Authenticated admins access dashboards, edit capsules, view collector emails, and upload new media through Cloudinary.

## Environment configuration

Create a `.env` or `.env.local` file with the following variables (React requires the `REACT_APP_` prefix):

```bash
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

REACT_APP_CLOUDINARY_CLOUD_NAME=...
REACT_APP_CLOUDINARY_UPLOAD_PRESET=...
```

**Firebase tips**

- Enable Email/Password inside Firebase Auth to unlock the admin console.
- Create the following Firestore collections: `capsules`, `orders`, `collectorEmails`, `metadata` (with `capsulesCounter` doc), plus any analytics docs referenced by the dashboard.
- Update `firestore.rules` to match your deployment (public read on `capsules`, admin-only writes, etc.).

**Cloudinary tips**

- Create an **unsigned upload preset** with the desired folder/transformations.
- Whitelist your domain inside the preset’s CORS settings.
- Store the `cloud_name` and `upload_preset` in the env vars above.

## Project structure

```
src/
├── admin/              # Admin-only layouts, components, and pages
├── components/         # Storefront UI (header, footer, cart, products)
├── context/            # Auth + Cart providers
├── hooks/              # Custom hooks (capsules, etc.)
├── pages/              # Storefront routes (Home, Checkout)
└── services/           # Firestore, Cloudinary, downloads, analytics helpers
```

Tailwind + PostCSS config live at the repo root. Firebase hosting rules and indexes live beside `firebase.json`.

## Storefront UX details

- **Hero & about sections** introduce the brand with subtle gradients and accessible typography.
- **Catalogue controls** include search, tag pills, and keyboard-accessible buttons.
- **Bento grid** auto-spans cards based on aspect ratios and index positions, delivering a magazine-style layout across breakpoints.
- **Product cards** use `object-cover` + inline `aspect-ratio` for consistent framing, with hover gradients and modal triggers.
- **Product modal** surfaces long-form metadata (story, prompt, resolutions, gallery), add-to-cart, and quick stats.
- **Cart drawer** highlights selected capsules, quantities, subtotals, and checkout CTA.

## Checkout flow

1. **Cart validation** – Ensures at least one capsule, calculates totals, and prompts for collector name/email.
2. **Email capture** – Writes to `collectorEmails` with `orderId`, `capsuleIds`, email, and timestamp for future marketing.
3. **Order record** – `orders` documents store buyer info, payment summary (client-side), and statuses for potential reconciliation.
4. **Stats + metadata** – Increments `stats.purchases` on each capsule and optional aggregate counters.
5. **ZIP creation** – JSZip assembles metadata, gallery, variation, and resolution assets per capsule, then FileSaver downloads `frame-vist-order-<id>.zip` locally.
6. **Instant confirmation** – Confirmation modal details what was purchased and where the download lives.

## Admin console

- **Auth wall** – `RequireAdmin` waits on Firebase Auth; unauthenticated users see the polished `AdminSignIn` page.
- **Dashboard** – Top-line stats (views, carts, purchases), latest orders, and collector email feed for quick outreach.
- **Capsules list** – Sortable table with edit/delete/publish toggles and quick filters.
- **Capsule form** – Multi-section layout with:
  - Core metadata (title, slug/id, artist, price, story, prompt)
  - Tags and moods (with type-ahead + pill removal)
  - Gallery + variations arrays (each slot can upload via Cloudinary or accept direct URLs)
  - Resolutions array for downloadable assets
  - Aspect-ratio auto-detection (reads uploaded image dimensions via the `Image` API)
  - Publish switch and stats seeding
- **Analytics** – Historical trends, top-performing capsules, and aggregated collector insights (where available in Firestore).

## Cloudinary uploads

1. Click an upload button inside the Capsule form.
2. Component hits Cloudinary unsigned endpoint with the preset & cloud name from env vars.
3. Successful responses return `secure_url`, automatically inserted into the matching field (main image, gallery slot, variation).
4. Errors bubble to the UI with retry guidance.

Because uploads are unsigned, keep the preset locked down to the specific folder/transformations and block dangerous formats on the Cloudinary side.

## Firestore collections & documents

| Collection                 | Schema highlights                                                                                                                                                                              | Notes                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `capsules`                 | `{ id, title, artist, description, story, prompt, price, aspectRatio, aspectRatioValue, tags[], gallery[], variations[], resolutions[], stats: { views, addedToCart, purchases }, published }` | Sequential IDs: `cap_0001`, etc. `published` defaults to `false` until toggled. |
| `orders`                   | `{ id, items[], subtotal, taxes?, total, collector: { name, email }, status, createdAt, downloadIssuedAt }`                                                                                    | Use server timestamps for ordering in the dashboard.                            |
| `collectorEmails`          | `{ id, email, name, orderId, capsuleIds[], createdAt }`                                                                                                                                        | Public writes (from checkout) but admin-only reads per Firestore rules.         |
| `metadata/capsulesCounter` | `{ nextValue, updatedAt }`                                                                                                                                                                     | Transactional counter for sequential IDs.                                       |
| `analytics/*` (optional)   | Custom docs for dashboard aggregates.                                                                                                                                                          |

Update `firestore.rules` to enforce:

- Public read-only access to `capsules` where `published == true`.
- Authenticated admin read/write elsewhere.
- Limited checkout write access to `orders` + `collectorEmails`.

## Security considerations

- **Auth-only admin** – The admin bundle is part of the React app, but protected at runtime by Firebase Auth + Firestore rules. Never expose admin credentials.
- **Unsigned uploads** – Treat Cloudinary preset like a credential; restrict allowed domains and formats.
- **Downloads** – Since assets are fetched client-side for ZIP packaging, ensure asset URLs are public and CORS-enabled.
- **Environment files** – Do not commit `.env*` files. CRA automatically injects vars prefixed with `REACT_APP_`.

## Development workflow

### Prerequisites

- Node 18+ (ideally LTS)
- npm 9+
- Firebase project + Cloudinary account

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) for the storefront, and append `/admin` for the console once authenticated.

### Execute tests

```bash
npm test
```

The suite currently relies on `react-scripts test` with Testing Library utilities for component-level coverage.

### Build for production

```bash
npm run build
```

### Backfill existing tag usage

When migrating to the dedicated `tags` collection, run the automated backfill to rescan every capsule and rebuild usage counts:

```bash
npm run backfill:tags
```

The script will:

1. Load Firebase credentials from `.env.local` (preferred) and `.env` if present.
2. Pull every capsule via Firestore.
3. Compare the desired tag usage (based on capsule metadata) against what currently exists in the `tags` collection.
4. Increment, decrement, or delete tag docs so counts stay in sync.

> **Heads-up:** The script relies on the same Firebase client credentials as the React app. Ensure your Firestore security rules allow the authenticated context you run it under (e.g., run `firebase login` + `npm run backfill:tags` while authenticated as an admin user, or execute it against an emulator).

Outputs hashed assets inside `build/`, ready for Firebase Hosting or any static host. Remember to set the appropriate rewrite rules in `firebase.json` for SPA routing.

## Deployment notes

1. Run `npm run build`.
2. Use `firebase deploy --only hosting` (or your preferred provider) to upload the `build/` directory.
3. Set environment vars inside your hosting CI or `.env.production` prior to the build.
4. Sync Firestore rules and indexes (`firebase deploy --only firestore:rules,firestore:indexes`).

## Troubleshooting

| Issue                           | Fix                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudinary “Unknown API key”    | Ensure env vars do **not** include angle brackets or quotes. Values must match the unsigned preset + cloud name exactly.                       |
| Capsule missing from storefront | Confirm `published` is `true` and the document includes valid image URLs + aspect ratio. The hook filters anything with `published === false`. |
| ZIP download broken             | Check browser console for failed asset fetches. All gallery/variation/resolution URLs must be publicly accessible with correct CORS headers.   |
| Admin route loops               | Verify Firebase Auth email is registered and allowed. Inspect `firestore.rules` for permission mismatches.                                     |

## Appendix: Create React App scripts

This project was bootstrapped with [Create React App](https://create-react-app.dev/). Standard scripts remain available:

- `npm start` – Start development server with hot reloading.
- `npm test` – Run Jest in watch mode.
- `npm run build` – Produce optimized production bundle.
- `npm run eject` – Copy CRA configs locally (irreversible; use only if you need custom tooling).

Refer to the [CRA documentation](https://create-react-app.dev/docs/getting-started/) for deeper customization guidance.
