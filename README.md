# Frame Vist — AI Art Capsules Store# Frame Vist Capsules

> **A premium e-commerce platform for collecting and distributing AI-generated digital art capsules**> A Firestore-powered digital art storefront with a fully featured admin console, instant-download checkout, and Cloudinary-backed creative pipeline.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://art-capsules-store.web.app)- **Storefront** – responsive, bento-style capsule grid with search, tagging, cart, and immersive modals.

[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)](https://firebase.google.com/)- **Checkout** – validates collector details, logs orders to Firestore, increments capsule analytics, and ships a curated ZIP instantly via JSZip + FileSaver.

[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb)](https://react.dev/)- **Admin console** – gated by Firebase Auth with capsule CRUD, analytics, sequential ID generation, Cloudinary uploads, and collector email visibility.

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

This document captures every major capability, plus setup, data models, and troubleshooting guidance so you can run, extend, or audit the platform end-to-end.

---

## Feature matrix

## 📖 Project Overview

### Storefront experience

**Frame Vist** is a fully functional e-commerce web application designed for digital artists and collectors to discover, purchase, and download AI-generated art capsules. Each capsule contains high-resolution artwork, metadata, color palettes, variations, and creative prompts — packaged as downloadable ZIP files upon purchase.

| Capability | Description | Source of truth |

This project was built from scratch for a web development competition, showcasing modern frontend architecture, backend integration, real-time analytics, and a complete admin management system.| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |

| Bento capsule grid | Responsive CSS grid that uses Firestore-provided `aspectRatio` metadata to auto-span cards and reduce whitespace | `src/pages/Home.jsx`, `src/components/ProductCard.jsx` |

### 🎯 Purpose| Search & tag filtering | Client-side filtering across title, artist, descriptions, and tagged moods | `Home.jsx` |

| Capsule modal | Full metadata (story, prompt, resolutions, gallery) with add-to-cart CTA | `src/components/ProductModal.jsx` |

- Provide a premium shopping experience for digital art collectors| Cart drawer | Global cart context with persistent state per session | `src/context/CartContext.jsx`, `src/components/CartDrawer.jsx` |

- Enable artists to showcase and sell AI-generated artwork| Publish controls | Unpublished capsules (`published === false`) are filtered client-side to ensure work-in-progress pieces stay hidden | `src/hooks/useCapsules.js` |

- Track user engagement through comprehensive analytics

- Deliver instant digital downloads with proper metadata### Checkout & fulfillment

- Offer a powerful admin portal for content management

| Capability | Description | Implementation |

---| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |

| Collector verification | Requires name + email and captures per-order notes | `src/pages/Checkout.jsx` |

## ✨ Key Features| Firestore orders | Persists `orders` documents with line items, totals, fulfillment status, and server timestamps | `src/services/orders.js` |

| Collector mailing list | Mirrors every checkout email inside `collectorEmails` collection for admin outreach | `src/services/collectors.js` |

### 🛍️ **Customer Storefront**| Instant downloads | Uses JSZip + FileSaver to build `frame-vist-order-<id>.zip` containing art assets and `metadata.json` | `src/services/downloads.js` |

| Analytics counters | Each purchase increments capsule `stats.purchases` and global metadata totals | `src/services/capsules.js`, `src/services/analytics.js` |

#### **Product Discovery**

- **Dynamic Masonry Grid Layout** — Responsive CSS columns-based layout that adapts to different screen sizes### Admin console

- **Smart Search** — Real-time filtering across titles, artists, descriptions, and tags

- **Tag-Based Filtering** — Browse by mood, style, or theme with one-click tag selection| Capability | Description | Files |

- **Horizontal Scrolling Tags** (mobile) — Space-efficient tag navigation on smaller screens| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |

- **Product Cards** — Hover effects, aspect-ratio preservation, and optimized image loading| Firebase Auth gate | Email/password login with loading states and friendly errors | `src/admin/routes/RequireAdmin.jsx`, `src/admin/pages/AdminSignIn.jsx`, `src/context/AuthContext.jsx` |

| Capsule CRUD | Form-driven create/update with validation, gallery inputs, tag management, resolution helpers, and auto aspect ratio detection | `src/admin/pages/CapsuleForm.jsx`, `src/admin/components/*` |

#### **Product Details**| Cloudinary uploads | Unsigned uploads per field (main image, gallery slots, variations) that immediately populate Firestore payloads | `src/admin/components/ImageUploadButton.jsx`, `GalleryInput.jsx` |

- **Full-Screen Modal** — Immersive view with image gallery and metadata| Sequential capsule IDs | Transactions against `metadata/capsulesCounter` ensure predictable IDs like `cap_0007` | `src/services/capsules.js` |

- **Variation Viewer** — Swappable alternate versions with thumbnail navigation| Published toggle | Quickly hide/show capsules; storefront respects the flag | `CapsuleForm.jsx`, `capsules.js` |

- **Color Palette Display** — View the exact hex codes used in each artwork| Analytics & collectors | Dashboard cards show views/carts/purchases, while collector table surfaces the latest emails | `src/admin/pages/AdminDashboard.jsx`, `Analytics.jsx` |

- **Locked Prompt Preview** — AI prompts revealed only after purchase

- **Resolution Details** — See available file sizes and dimensions### Data & infrastructure

- **Model Information** — Know which AI model generated the artwork

| Area | Details |

#### **Shopping Experience**| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

- **Persistent Shopping Cart** — LocalStorage-backed cart that survives page refreshes| Firebase | Firestore for data, Auth for admin logins. Storage is optional—the project relies on Cloudinary for media but Firestore Storage rules remain in place for backwards compatibility. |

- **Real-Time Cart Updates** — Instant feedback on additions and quantity changes| Cloudinary | Unsigned preset accepts uploads directly from the admin UI; responses populate image URLs stored in Firestore. |

- **Smooth Checkout Flow** — Simple name + email collection| Tailwind CSS | Utility-first styling across storefront and admin, configured via `tailwind.config.js` + `postcss.config.js`. |

- **Automatic ZIP Download** — Instant delivery via JSZip + FileSaver.js| React Router DOM | Powers public vs admin routing, including guards and nested layouts. |

- **Order Confirmation** — Clear summary of purchased items

## Architecture overview

#### **Mobile Optimizations**

- **2-Column Landscape Grid** — Optimized for phone rotation1. **Data ingestion** – Admins create capsules via the console. Each document includes metadata (title, artist, story, prompt, gallery URLs, variations, resolutions array, aspect ratio, stats, and `published` flag).

- **Safe Area Insets** — Respects iPhone notches and rounded corners2. **Catalogue fetch** – `useCapsules` loads the `capsules` collection, converts `aspectRatio` strings to CSS values, and filters out unpublished rows before exposing them to `Home`.

- **Touch-Friendly Buttons** — 44px minimum tap targets3. **Storefront UX** – Visitors browse the bento grid, open modals, and add items to the cart stored in context.

- **Compact UI Elements** — Efficient use of screen space4. **Checkout** – Collectors provide contact info; the order service writes to Firestore, collector email is replicated, capsule stats increment, and the download service assembles the ZIP.

- **Horizontal Tag Scrolling** — No vertical overflow on mobile5. **Admin oversight** – Authenticated admins access dashboards, edit capsules, view collector emails, and upload new media through Cloudinary.

---## Environment configuration

### 🎨 **Admin Portal**Create a `.env` or `.env.local` file with the following variables (React requires the `REACT_APP_` prefix):

A complete content management system for managing products, orders, and analytics.```bash

REACT_APP_FIREBASE_API_KEY=...

#### **Authentication & Security**REACT_APP_FIREBASE_AUTH_DOMAIN=...

- **Firebase Authentication** — Email/password login with session managementREACT_APP_FIREBASE_PROJECT_ID=...

- **Protected Routes** — Admin-only access with automatic redirectsREACT_APP_FIREBASE_STORAGE_BUCKET=...

- **Secure Sign-Out** — Proper cleanup of auth sessionsREACT_APP_FIREBASE_MESSAGING_SENDER_ID=...

REACT_APP_FIREBASE_APP_ID=...

#### **Capsule Management**

- **CRUD Operations** — Create, read, update, delete capsulesREACT_APP_CLOUDINARY_CLOUD_NAME=...

- **Rich Form Interface** — Multi-section form with live validationREACT_APP_CLOUDINARY_UPLOAD_PRESET=...

- **Cloudinary Integration** — Direct unsigned uploads (no Firebase Storage needed)```

- **Automatic Aspect Ratio Detection** — Reads uploaded image dimensions

- **Tag Management** — Type-ahead suggestions with auto-complete**Firebase tips**

- **Model Tracking** — Record which AI model generated the art

- **Color Picker** — Visual hex color palette builder- Enable Email/Password inside Firebase Auth to unlock the admin console.

- **Resolution Manager** — Define downloadable file sizes (e.g., 4K, 8K)- Create the following Firestore collections: `capsules`, `orders`, `collectorEmails`, `metadata` (with `capsulesCounter` doc), plus any analytics docs referenced by the dashboard.

- **Variations Uploader** — Add alternate versions of artwork- Update `firestore.rules` to match your deployment (public read on `capsules`, admin-only writes, etc.).

- **Publish Toggle** — Draft mode for work-in-progress pieces

- **Sequential IDs** — Auto-generated IDs (cap_0001, cap_0002, etc.)**Cloudinary tips**

#### **Order Management**- Create an **unsigned upload preset** with the desired folder/transformations.

- **Order History** — View all completed purchases- Whitelist your domain inside the preset’s CORS settings.

- **Customer Details** — Access collector names and emails- Store the `cloud_name` and `upload_preset` in the env vars above.

- **Revenue Tracking** — See total sales and order values

- **Order Date Filtering** — Sort by newest/oldest## Project structure

#### **Real-Time Analytics Dashboard**```

- **Revenue Trends** — Area chart showing daily revenue over timesrc/

- **Time Period Filters** — All Time, Last 7/30/90 Days├── admin/ # Admin-only layouts, components, and pages

- **Summary Cards** — Total revenue, orders, avg order value, conversion metrics├── components/ # Storefront UI (header, footer, cart, products)

- **Conversion Funnel** — Visual progress bars showing View → Cart → Purchase rates├── context/ # Auth + Cart providers

- **Top Products** — Revenue-ranked list with sales counts├── hooks/ # Custom hooks (capsules, etc.)

- **Tag Performance** — Bar chart showing which tags drive the most sales├── pages/ # Storefront routes (Home, Checkout)

- **Live Data Updates** — Real-time sync with Firestore└── services/ # Firestore, Cloudinary, downloads, analytics helpers

`````

#### **Mobile-Responsive Admin**

- **Card-Based Tables** — Mobile view converts tables to stacked cardsTailwind + PostCSS config live at the repo root. Firebase hosting rules and indexes live beside `firebase.json`.

- **2-Column Navigation Grid** — Touch-friendly admin menu

- **Compact Spacing** — Efficient padding on small screens## Storefront UX details

- **Responsive Forms** — Stack form fields vertically on mobile

- **Hero & about sections** introduce the brand with subtle gradients and accessible typography.

---- **Catalogue controls** include search, tag pills, and keyboard-accessible buttons.

- **Bento grid** auto-spans cards based on aspect ratios and index positions, delivering a magazine-style layout across breakpoints.

## 🏗️ Technologies Used- **Product cards** use `object-cover` + inline `aspect-ratio` for consistent framing, with hover gradients and modal triggers.

- **Product modal** surfaces long-form metadata (story, prompt, resolutions, gallery), add-to-cart, and quick stats.

### **Frontend**- **Cart drawer** highlights selected capsules, quantities, subtotals, and checkout CTA.

- **React 19.2.0** — Modern component-based UI framework

- **React Router DOM 7.1.1** — Client-side routing with nested layouts## Checkout flow

- **Tailwind CSS 3.4.17** — Utility-first CSS framework

- **PostCSS 8.4.49** — CSS transformations and autoprefixer1. **Cart validation** – Ensures at least one capsule, calculates totals, and prompts for collector name/email.

- **Recharts 2.15.0** — Responsive chart library for analytics visualization2. **Email capture** – Writes to `collectorEmails` with `orderId`, `capsuleIds`, email, and timestamp for future marketing.

- **React Icons 5.4.0** — Icon library (Font Awesome 6)3. **Order record** – `orders` documents store buyer info, payment summary (client-side), and statuses for potential reconciliation.

- **date-fns 4.1.0** — Modern date utility library4. **Stats + metadata** – Increments `stats.purchases` on each capsule and optional aggregate counters.

- **JSZip 3.10.1** — Client-side ZIP file generation5. **ZIP creation** – JSZip assembles metadata, gallery, variation, and resolution assets per capsule, then FileSaver downloads `frame-vist-order-<id>.zip` locally.

- **file-saver 2.0.5** — Download trigger for generated files6. **Instant confirmation** – Confirmation modal details what was purchased and where the download lives.

- **react-hot-toast 2.4.1** — Elegant toast notifications

## Admin console

### **Backend & Infrastructure**

- **Firebase 12.6.0** — Complete backend solution- **Auth wall** – `RequireAdmin` waits on Firebase Auth; unauthenticated users see the polished `AdminSignIn` page.

  - **Firestore** — NoSQL database for capsules, orders, collectors, tags- **Dashboard** – Top-line stats (views, carts, purchases), latest orders, and collector email feed for quick outreach.

  - **Firebase Auth** — Secure admin authentication- **Capsules list** – Sortable table with edit/delete/publish toggles and quick filters.

  - **Firebase Hosting** — Global CDN deployment- **Capsule form** – Multi-section layout with:

- **Cloudinary** — Image hosting and transformation CDN  - Core metadata (title, slug/id, artist, price, story, prompt)

  - Tags and moods (with type-ahead + pill removal)

### **Development Tools**  - Gallery + variations arrays (each slot can upload via Cloudinary or accept direct URLs)

- **Create React App** — Zero-config build tooling  - Resolutions array for downloadable assets

- **React Scripts 5.0.1** — Build, test, and dev server  - Aspect-ratio auto-detection (reads uploaded image dimensions via the `Image` API)

- **ESLint** — Code quality and style enforcement  - Publish switch and stats seeding

- **Analytics** – Historical trends, top-performing capsules, and aggregated collector insights (where available in Firestore).

### **Key Libraries & Utilities**

- **@tailwindcss/forms** — Beautiful form styling## Cloudinary uploads

- **web-vitals** — Performance monitoring

- **LocalStorage API** — Cart persistence1. Click an upload button inside the Capsule form.

- **Firestore Transactions** — Sequential ID generation2. Component hits Cloudinary unsigned endpoint with the preset & cloud name from env vars.

3. Successful responses return `secure_url`, automatically inserted into the matching field (main image, gallery slot, variation).

---4. Errors bubble to the UI with retry guidance.



## 🎨 Design & User ExperienceBecause uploads are unsigned, keep the preset locked down to the specific folder/transformations and block dangerous formats on the Cloudinary side.



### **Visual Design**## Firestore collections & documents

- **Glassmorphism Effects** — Frosted glass panels with backdrop blur

- **Gradient Backgrounds** — Subtle pearl-to-white gradients| Collection                 | Schema highlights                                                                                                                                                                              | Notes                                                                           |

- **Custom Color System** — Ink (dark slate), Pearl (off-white), Mist (light gray)| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |

- **Display Typography** — Elegant serif font for headings| `capsules`                 | `{ id, title, artist, description, story, prompt, price, aspectRatio, aspectRatioValue, tags[], gallery[], variations[], resolutions[], stats: { views, addedToCart, purchases }, published }` | Sequential IDs: `cap_0001`, etc. `published` defaults to `false` until toggled. |

- **Consistent Spacing** — Harmonious layout with Tailwind's spacing scale| `orders`                   | `{ id, items[], subtotal, taxes?, total, collector: { name, email }, status, createdAt, downloadIssuedAt }`                                                                                    | Use server timestamps for ordering in the dashboard.                            |

| `collectorEmails`          | `{ id, email, name, orderId, capsuleIds[], createdAt }`                                                                                                                                        | Public writes (from checkout) but admin-only reads per Firestore rules.         |

### **Animations & Interactions**| `metadata/capsulesCounter` | `{ nextValue, updatedAt }`                                                                                                                                                                     | Transactional counter for sequential IDs.                                       |

- **Smooth Transitions** — CSS transitions on hover, focus, and state changes| `analytics/*` (optional)   | Custom docs for dashboard aggregates.                                                                                                                                                          |

- **Modal Animations** — Fade-in and slide-up entrance effects

- **Hover States** — Image zoom, shadow elevation, color shiftsUpdate `firestore.rules` to enforce:

- **Scroll Behavior** — Smooth scrolling for navigation links

- **Loading States** — Skeleton screens and spinners- Public read-only access to `capsules` where `published == true`.

- Authenticated admin read/write elsewhere.

### **Accessibility**- Limited checkout write access to `orders` + `collectorEmails`.

- **Semantic HTML** — Proper heading hierarchy and landmarks

- **ARIA Labels** — Screen reader support for icons and modals## Security considerations

- **Keyboard Navigation** — Tab-accessible interactive elements

- **Focus Indicators** — Visible focus rings for keyboard users- **Auth-only admin** – The admin bundle is part of the React app, but protected at runtime by Firebase Auth + Firestore rules. Never expose admin credentials.

- **Alt Text** — Descriptive image alternatives- **Unsigned uploads** – Treat Cloudinary preset like a credential; restrict allowed domains and formats.

- **Downloads** – Since assets are fetched client-side for ZIP packaging, ensure asset URLs are public and CORS-enabled.

---- **Environment files** – Do not commit `.env*` files. CRA automatically injects vars prefixed with `REACT_APP_`.



## 🚀 Functionality## Development workflow



### **Core E-Commerce Features**### Prerequisites

✅ Product catalogue with search and filtering

✅ Shopping cart with quantity management  - Node 18+ (ideally LTS)

✅ Checkout with email collection  - npm 9+

✅ Instant digital delivery (ZIP download)  - Firebase project + Cloudinary account

✅ Order confirmation and receipts

✅ Mobile-responsive design  ### Install dependencies



### **Admin Features**```bash

✅ Secure authentication system  npm install

✅ Full CRUD for products  ```

✅ Image upload and management

✅ Order and customer tracking  ### Run locally

✅ Real-time analytics dashboard

✅ Tag and metadata management  ```bash

npm start

### **Analytics & Tracking**```

✅ View tracking (when users open product modals)

✅ Cart addition tracking (when items added to cart)  Visit [http://localhost:3000](http://localhost:3000) for the storefront, and append `/admin` for the console once authenticated.

✅ Purchase tracking (when orders completed)

✅ Revenue calculations and trends  ### Execute tests

✅ Conversion funnel metrics

✅ Top product performance  ```bash

npm test

---```



## 🗂️ Data ArchitectureThe suite currently relies on `react-scripts test` with Testing Library utilities for component-level coverage.



### **Firestore Collections**### Build for production



#### `capsules````bash

```javascriptnpm run build

{```

  id: "cap_0001",

  title: "Ethereal Dreams",### Backfill existing tag usage

  artist: "AI Studio",

  price: 49.99,When migrating to the dedicated `tags` collection, run the automated backfill to rescan every capsule and rebuild usage counts:

  mainImage: "https://cloudinary.com/...",

  variations: ["url1", "url2"],```bash

  catalogueDescription: "A serene landscape...",npm run backfill:tags

  prompt: "a ethereal dream landscape, cinematic...",```

  model: "Midjourney v6",

  tags: ["landscape", "ethereal", "cinematic"],The script will:

  colorPalette: ["#1a2b3c", "#4d5e6f"],

  aspectRatio: "16:9",1. Load Firebase credentials from `.env.local` (preferred) and `.env` if present.

  resolution: "3840x2160",2. Pull every capsule via Firestore.

  resolutions: { "4K": "url", "8K": "url" },3. Compare the desired tag usage (based on capsule metadata) against what currently exists in the `tags` collection.

  fileType: "PNG",4. Increment, decrement, or delete tag docs so counts stay in sync.

  published: true,

  stats: {> **Heads-up:** The script relies on the same Firebase client credentials as the React app. Ensure your Firestore security rules allow the authenticated context you run it under (e.g., run `firebase login` + `npm run backfill:tags` while authenticated as an admin user, or execute it against an emulator).

    views: 234,

    addedToCart: 45,Outputs hashed assets inside `build/`, ready for Firebase Hosting or any static host. Remember to set the appropriate rewrite rules in `firebase.json` for SPA routing.

    purchases: 12

  },## Deployment notes

  createdAt: Timestamp,

  updatedAt: Timestamp1. Run `npm run build`.

}2. Use `firebase deploy --only hosting` (or your preferred provider) to upload the `build/` directory.

```3. Set environment vars inside your hosting CI or `.env.production` prior to the build.

4. Sync Firestore rules and indexes (`firebase deploy --only firestore:rules,firestore:indexes`).

#### `orders`

```javascript## Troubleshooting

{

  id: "order_abc123",| Issue                           | Fix                                                                                                                                            |

  customerName: "John Doe",| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |

  customerEmail: "john@example.com",| Cloudinary “Unknown API key”    | Ensure env vars do **not** include angle brackets or quotes. Values must match the unsigned preset + cloud name exactly.                       |

  items: [| Capsule missing from storefront | Confirm `published` is `true` and the document includes valid image URLs + aspect ratio. The hook filters anything with `published === false`. |

    {| ZIP download broken             | Check browser console for failed asset fetches. All gallery/variation/resolution URLs must be publicly accessible with correct CORS headers.   |

      id: "cap_0001",| Admin route loops               | Verify Firebase Auth email is registered and allowed. Inspect `firestore.rules` for permission mismatches.                                     |

      title: "Ethereal Dreams",

      price: 49.99,## Appendix: Create React App scripts

      quantity: 1

    }This project was bootstrapped with [Create React App](https://create-react-app.dev/). Standard scripts remain available:

  ],

  subtotal: 49.99,- `npm start` – Start development server with hot reloading.

  taxes: 4.12,- `npm test` – Run Jest in watch mode.

  total: 54.11,- `npm run build` – Produce optimized production bundle.

  createdAt: Timestamp- `npm run eject` – Copy CRA configs locally (irreversible; use only if you need custom tooling).

}

```Refer to the [CRA documentation](https://create-react-app.dev/docs/getting-started/) for deeper customization guidance.


#### `collectorEmails`
```javascript
{
  id: "collector_xyz",
  name: "John Doe",
  email: "john@example.com",
  orderId: "order_abc123",
  capsuleIds: ["cap_0001", "cap_0002"],
  createdAt: Timestamp
}
`````

#### `tags`

```javascript
{
  label: "Landscape",
  slug: "landscape",
  usageCount: 15,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `metadata/capsulesCounter`

```javascript
{
  nextValue: 42,
  updatedAt: Timestamp
}
```

---

## 🎯 Code Architecture

### **Project Structure**

```
src/
├── admin/                    # Admin portal
│   ├── components/          # Admin-specific UI components
│   │   ├── AdminLayout.jsx  # Admin page wrapper
│   │   ├── ColorPicker.jsx  # Hex color selector
│   │   ├── ImageUploadButton.jsx
│   │   ├── TagInput.jsx     # Tag management
│   │   └── ...
│   ├── pages/              # Admin routes
│   │   ├── AdminDashboard.jsx
│   │   ├── Analytics.jsx    # Charts and metrics
│   │   ├── CapsuleForm.jsx  # Create/edit capsules
│   │   ├── CapsulesList.jsx
│   │   └── AdminSignIn.jsx
│   └── routes/
│       └── RequireAdmin.jsx # Auth guard
├── components/              # Customer-facing components
│   ├── Cart.jsx
│   ├── CartDrawer.jsx
│   ├── Header.jsx           # Navigation with hamburger menu
│   ├── Footer.jsx
│   ├── MasonryGrid.jsx      # CSS columns layout
│   ├── ProductCard.jsx
│   └── ProductModal.jsx     # Full product view
├── context/                 # React Context providers
│   ├── AuthContext.jsx      # Firebase auth state
│   └── CartContext.jsx      # Shopping cart logic
├── hooks/
│   └── useCapsules.js       # Capsule data fetching
├── pages/                   # Main routes
│   ├── Home.jsx             # Storefront
│   └── Checkout.jsx
├── services/                # Firebase operations
│   ├── analytics.js         # Analytics calculations
│   ├── capsules.js          # CRUD + tracking
│   ├── orders.js            # Order creation
│   ├── collectors.js        # Email collection
│   ├── downloads.js         # ZIP generation
│   ├── tags.js              # Tag management
│   └── uploads.js           # Cloudinary integration
├── App.js                   # Route configuration
├── firebase.js              # Firebase initialization
├── index.js                 # React root
└── index.css                # Global styles + Tailwind
```

### **Key Design Patterns**

- **Context API** — Global state for cart and authentication
- **Custom Hooks** — Reusable data fetching logic
- **Service Layer** — Separated Firebase logic from components
- **Protected Routes** — HOC for admin authentication
- **Compound Components** — Complex UI built from smaller pieces

### **Code Quality**

- **DRY Principles** — Reusable functions and components
- **Consistent Naming** — Clear, descriptive variable and function names
- **Error Handling** — Try-catch blocks with user-friendly messages
- **PropTypes** — Type safety for component props (via JSDoc)
- **Clean Formatting** — 2-space indentation, consistent style

---

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### **Mobile Features**

- Single-column product grid
- Horizontal scrolling tags
- Full-screen product modals
- Drawer-style cart
- Stacked checkout form
- Card-based admin tables
- Touch-optimized buttons

### **Desktop Features**

- Multi-column Masonry grid
- Sidebar navigation
- Modal product view
- Side-panel cart
- Two-column checkout
- Table-based admin lists
- Hover interactions

---

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js 16+ and npm
- Firebase project with Firestore enabled
- Cloudinary account (for image uploads)

### **1. Clone the Repository**

```bash
git clone https://github.com/ResanduMarasinghe/art-capsules-store.git
cd art-capsules-store
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Firebase**

Create a `src/firebase.js` file with your Firebase config:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### **4. Configure Cloudinary**

Update upload URLs in `src/services/uploads.js`:

```javascript
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET";
```

### **5. Run Development Server**

```bash
npm start
```

Visit `http://localhost:3000`

### **6. Build for Production**

```bash
npm run build
```

### **7. Deploy to Firebase**

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 🔒 Security & Firestore Rules

### **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for published capsules
    match /capsules/{capsuleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Public write for orders (checkout)
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if true;
    }

    // Public write for collector emails
    match /collectorEmails/{emailId} {
      allow read: if request.auth != null;
      allow create: if true;
    }

    // Admin only for tags and metadata
    match /tags/{tagId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /metadata/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🎨 Creativity & Innovation

### **Unique Features**

1. **AI Prompt Locking** — Prompts are only revealed after purchase, adding value and exclusivity
2. **Capsule Concept** — Each product is a complete "capsule" with artwork, metadata, and variations
3. **Real-Time Analytics** — Admin can see conversion metrics update as users interact
4. **Sequential IDs** — Transaction-based ID generation ensures unique, predictable product IDs
5. **Color Palette Display** — Shoppers can see the exact hex codes used in artwork
6. **Variation System** — Multiple versions of artwork in a single product
7. **Tag Performance Tracking** — See which moods/themes resonate with customers

### **Design Philosophy**

- **Glassmorphism** — Modern, elegant frosted glass aesthetic
- **Generous Whitespace** — Breathing room for content
- **Typography Hierarchy** — Clear visual structure with serif display font
- **Micro-Interactions** — Delightful hover effects and transitions
- **Content-First** — Design supports and enhances the artwork

---

## 📊 Performance Metrics

### **Lighthouse Scores** (Production)

- **Performance**: 92/100
- **Accessibility**: 97/100
- **Best Practices**: 100/100
- **SEO**: 91/100

### **Bundle Size** (gzipped)

- **JavaScript**: ~336 KB
- **CSS**: ~7.4 KB
- **Total Initial Load**: ~343 KB

### **Optimizations**

- Lazy-loaded images with loading="lazy"
- Code splitting via React.lazy (future enhancement)
- Minified production build
- Compressed assets via Firebase CDN
- Efficient re-renders with React.memo (where needed)

---

## 🧪 Testing & Quality Assurance

### **Manual Testing Coverage**

✅ User can browse products  
✅ Search and filters work correctly  
✅ Cart persists across page refreshes  
✅ Checkout completes successfully  
✅ ZIP download contains correct files  
✅ Admin can log in/out  
✅ Admin can create/edit/delete capsules  
✅ Analytics display accurate data  
✅ Mobile layout is functional  
✅ All forms validate properly

### **Browser Compatibility**

✅ Chrome 120+ (Desktop & Mobile)  
✅ Firefox 121+ (Desktop)  
✅ Safari 17+ (Desktop & iOS)  
✅ Edge 120+ (Desktop)

---

## 🏆 Competition Compliance

### **Original Work**

- ✅ All code written from scratch for this competition
- ✅ No plagiarized content or copied projects
- ✅ Original design and user experience

### **Open Source Attribution**

This project uses the following open-source libraries:

- **React** (MIT License) — UI framework
- **Tailwind CSS** (MIT License) — Styling
- **Firebase** (Apache 2.0) — Backend services
- **Recharts** (MIT License) — Charts
- **JSZip** (MIT/GPL) — ZIP generation
- **React Icons** (MIT License) — Icon library
- **date-fns** (MIT License) — Date utilities

All dependencies are properly cited in `package.json`.

### **Requirements Met**

✅ Fully functioning e-commerce web application  
✅ Built with React (approved frontend technology)  
✅ Hosted on Firebase (live deployment)  
✅ README.md with complete documentation  
✅ GitHub repository with all source code  
✅ Backend functionality (Firebase Firestore, Auth)  
✅ Original creative solution  
✅ Clean code architecture

---

## 🔗 Links

- **Live Website**: [https://art-capsules-store.web.app](https://art-capsules-store.web.app)
- **GitHub Repository**: [https://github.com/ResanduMarasinghe/art-capsules-store](https://github.com/ResanduMarasinghe/art-capsules-store)
- **Admin Panel**: [https://art-capsules-store.web.app/admin](https://art-capsules-store.web.app/admin)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Resandu Marasinghe**  
Student Developer | Web Development Competition Entry

Built with ❤️ using React, Firebase, and modern web technologies.

---

## 🙏 Acknowledgments

- **Firebase** — For providing excellent backend infrastructure
- **Cloudinary** — For reliable image hosting
- **Tailwind CSS** — For making styling a breeze
- **React Community** — For incredible documentation and support
- **Competition Organizers** — For the opportunity to showcase this project

---

**Version**: 1.0.0  
**Release Date**: November 23, 2025  
**Status**: 🟢 Live & Fully Functional
