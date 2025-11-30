# Frame Vist — AI Art Capsules Store

> **A premium e-commerce platform for collecting AI-generated digital art**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://art-capsules-store.web.app)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6-orange)](https://firebase.google.com/)

**Live Site**: [https://art-capsules-store.web.app](https://art-capsules-store.web.app)  
**Admin Panel**: [https://art-capsules-store.web.app/admin](https://art-capsules-store.web.app/admin)

---

## 📖 About

Frame Vist is a fully functional e-commerce web application for discovering, purchasing, and downloading AI-generated art "capsules." Each capsule includes high-resolution artwork, metadata, color palettes, variations, and AI prompts — delivered as instant ZIP downloads.

This project demonstrates modern full-stack development with React, Firebase, and a complete admin management system.

---

## ✨ Key Features

### 🛍️ **Customer Storefront**

- **Responsive Masonry Grid** — CSS columns layout with dynamic product cards
- **Smart Search & Filtering** — Real-time search across titles, artists, and tags
- **Product Modals** — Full-screen view with image gallery and metadata
- **Shopping Cart** — Persistent cart with LocalStorage
- **Instant Checkout** — Email collection + automatic ZIP download
- **Mobile Optimized** — Touch-friendly UI with safe area insets

### 🎨 **Admin Portal**

- **Authentication** — Firebase email/password login with protected routes
- **Capsule Management** — Full CRUD operations with rich form interface
- **Cloudinary Integration** — Direct image uploads (no Firebase Storage)
- **Real-Time Analytics** — Revenue trends, conversion metrics, top products
- **Order Tracking** — Complete order history and customer database
- **Tag Management** — Auto-suggest system with usage tracking
- **Mobile Responsive** — Card-based layouts for small screens

### 📊 **Analytics Dashboard**

- Revenue trends with area charts (7/30/90 days + all-time)
- Conversion funnel (View → Cart → Purchase)
- Top-performing products and tags
- Real-time tracking: views, cart additions, purchases
- Summary metrics: revenue, orders, avg order value

---

## 🛠️ Technologies Used

### **Frontend**

- **React 19.2.0** — Modern UI framework with hooks
- **React Router 7.1.1** — Client-side routing
- **Tailwind CSS 3.4.17** — Utility-first styling
- **Recharts 2.15.0** — Analytics visualization
- **JSZip 3.10.1** — Client-side ZIP generation
- **FileSaver 2.0.5** — File download handling

### **Backend & Services**

- **Firebase 12.6.0**
  - **Firestore** — NoSQL database
  - **Firebase Auth** — Admin authentication
  - **Firebase Hosting** — Deployment
- **Cloudinary** — Image hosting CDN

### **Development**

- **Create React App** — Build tooling
- **PostCSS** — CSS processing
- **ESLint** — Code quality

---

## 🗂️ Project Structure

```
src/
├── admin/              # Admin portal
│   ├── components/     # Admin UI (forms, inputs, layout)
│   ├── pages/          # Dashboard, analytics, capsule management
│   └── routes/         # Auth guards
├── components/         # Customer UI (cart, cards, modals)
├── context/           # Auth & cart state management
├── pages/             # Home & checkout
├── services/          # Firebase operations & business logic
├── App.js             # Route configuration
└── firebase.js        # Firebase initialization
```

---

## 🚀 Installation & Setup

### **1. Clone Repository**

```bash
git clone https://github.com/ResanduMarasinghe/art-capsules-store.git
cd art-capsules-store
npm install
```

### **2. Firebase Configuration**

Create `src/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### **3. Cloudinary Setup**

Update `src/services/uploads.js`:

```javascript
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload";
const UPLOAD_PRESET = "YOUR_PRESET";
```

### **4. Grant Admin Access**

Create a document at `adminSettings/core` inside Firestore with an array of allowed admin emails:

```json
{
  "allowedEmails": ["owner@example.com", "teammate@example.com"]
}
```

Any authenticated user whose email appears in that array (or who has a custom Firebase auth claim `admin=true`) can manage capsules, orders, and promo codes.

### **5. Run & Deploy**

```bash
npm start              # Development server (localhost:3000)
npm run build          # Production build
firebase deploy        # Deploy to Firebase Hosting
```

---

## 🎯 Core Functionality

### **E-Commerce Features**

✅ Product catalogue with search/filtering  
✅ Shopping cart with quantity management  
✅ Checkout with email collection  
✅ Instant ZIP download delivery  
✅ Mobile-responsive design

### **Admin Features**

✅ Secure authentication  
✅ Product CRUD operations  
✅ Image upload management  
✅ Order & customer tracking  
✅ Real-time analytics

### **Tracking & Analytics**

✅ View tracking (modal opens)  
✅ Cart tracking (add to cart)  
✅ Purchase tracking (checkout)  
✅ Revenue calculations  
✅ Conversion metrics

---

## 📊 Data Architecture

### **Firestore Collections**

**`capsules`** — Products

```javascript
{
  id: "cap_0001",
  title, artist, price,
  mainImage, variations,
  prompt, model, tags,
  colorPalette, aspectRatio,
  published,
  stats: { views, addedToCart, purchases }
}
```

**`orders`** — Purchases

```javascript
{
  id, customerName, customerEmail,
  items: [{ id, title, price, quantity }],
  subtotal, taxes, total,
  createdAt
}
```

**`collectorEmails`** — Customer database  
**`tags`** — Tag management  
**`metadata/capsulesCounter`** — Sequential ID generation

---

## 🎨 Design Highlights

- **Glassmorphism** — Frosted glass panels with backdrop blur
- **Responsive Grid** — CSS columns Masonry layout
- **Smooth Animations** — Transitions, hover effects, modal entrances
- **Mobile-First** — Touch-optimized, safe area support
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation

---

## 📚 Open-Source Libraries Used

- React (MIT), Tailwind CSS (MIT), Firebase (Apache 2.0)
- Recharts (MIT), JSZip (MIT/GPL), React Icons (MIT)
- All properly cited in `package.json`

---

## 📈 Performance

**Lighthouse Scores**: Performance 92 | Accessibility 97 | Best Practices 100 | SEO 91  
**Bundle Size**: ~336 KB JS + ~7.4 KB CSS (gzipped)

---

## 🔒 Security

Firestore security rules allow:

- Public read for published capsules
- Public write for orders/emails (checkout)
- Admin-only write for capsules/tags
- Proper auth validation

---

## 🌟 Unique Features

1. **AI Prompt Locking** — Prompts revealed only after purchase
2. **Capsule Concept** — Complete art packages with metadata
3. **Real-Time Analytics** — Live conversion tracking
4. **Sequential IDs** — Transaction-based unique IDs (cap_0001, cap_0002...)
5. **Color Palette Display** — Show exact hex codes used
6. **Tag Performance** — See which themes drive sales

---

## 👨‍💻 Developer

**Resandu Marasinghe**  
Student Developer

Built with React, Firebase, and modern web technologies.

---

**Version**: 1.0.0  
**Status**: 🟢 Live & Fully Functional
