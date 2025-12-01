# Art Capsules Store

Art Capsules Store is a modern digital art marketplace and admin dashboard built with React and Firebase. The platform enables users to discover, preview, and purchase curated digital art capsules, while providing administrators with robust management and analytics tools.

---

## Features

### Main Site

- Responsive bento and masonry grid for capsule browsing
- Modern hero section
- Capsule quick preview with image carousel
- Add-to-cart with instant feedback and cart drawer
- Secure checkout with promo code support
- Tag and search-based filtering
- Capsule detail modal with keyboard navigation

### Admin Panel

- Secure admin authentication and access control using Firebase Auth
- Dashboard overview: sales, analytics, active promos
- Capsule management: add, edit, preview, delete
- Image upload and gallery input for capsule variations
- Tag and promo code management
- Real-time analytics and order tracking
- Firestore database integration for capsules, orders, users

---

## Live Demo

- Storefront: [art-capsules-store.web.app](https://art-capsules-store.web.app/)
- Admin Dashboard: [art-capsules-store.web.app/admin](https://art-capsules-store.web.app/admin) _(requires admin credentials)_

---

## Screenshots & Visuals

<div align="center">
      <img src="docs/screenshots/hero_section.png" alt="Hero Section" width="600" />
   <br><sub><b>Hero Section</b> — Modern, welcoming entry point for users</sub>
   <br><br>
      <img src="docs/screenshots/bento_grid.png" alt="Storefront Grid" width="600" />
   <br><sub><b>Storefront Grid</b> — Responsive bento and masonry layout for browsing capsules</sub>
   <br><br>
      <img src="docs/screenshots/product_modal_1.png" alt="Capsule Detail Modal 1" width="600" />
   <br><sub><b>Capsule Detail Modal</b> — Quick preview with image carousel and details</sub>
   <br><br>
      <img src="docs/screenshots/product_modal_2.png" alt="Capsule Detail Modal 2" width="600" />
   <br><sub><b>Capsule Detail Modal (Alt)</b> — Keyboard navigation and variant preview</sub>
   <br><br>
      <img src="docs/screenshots/checkout.png" alt="Checkout Process" width="600" />
   <br><sub><b>Checkout Process</b> — Promo codes, and secure checkout</sub>
   <br><br>
      <img src="docs/screenshots/admin_dashboard.png" alt="Admin Dashboard" width="600" />
   <br><sub><b>Admin Dashboard</b> — Overview of sales, analytics and collector activity</sub>
   <br><br>
      <img src="docs/screenshots/admin_capsules.png" alt="Capsules as Admin" width="600" />
   <br><sub><b>Capsule Management</b> — Add, edit, preview, and delete capsules</sub>
   <br><br>
      <img src="docs/screenshots/admin_analytics_1.png" alt="Admin Analytics 1" width="600" />
   <br><sub><b>Admin Analytics</b> — Real-time analytics and order tracking</sub>
   <br><br>
      <img src="docs/screenshots/admin_analytics_2.png" alt="Admin Analytics 2" width="600" />
   <br><sub><b>Admin Analytics (Alt)</b> — Tag management</sub>
   <br><br>
      <img src="docs/screenshots/firestore.png" alt="Firestore Database" width="600" />
   <br><sub><b>Firestore Database</b> — Capsules, orders, and users stored in Firestore</sub>
</div>

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Firebase, Firestore
- **Image Hosting:** Cloudinary
- **Authentication:** Firebase Auth
- **Deployment:** Firebase Hosting

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ResanduMarasinghe/art-capsules-store.git
   cd art-capsules-store
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**

   - Create a file named `.env.local` in the project root with your Firebase and Cloudinary credentials:

     ```env
     REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

     REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
     ```

   - **Important:** Never commit your `.env.local` file or secrets to version control.

4. **Configure Firebase:**
   - Add your Firebase config to `src/firebase.js`.
   - Set up Firestore rules and indexes as needed.
5. **Configure Cloudinary for image uploads:**
   - Sign up at [Cloudinary](https://cloudinary.com/) and create a new account.
   - In your Cloudinary dashboard, get your **Cloud Name** and create an **unsigned upload preset** for client-side uploads.
   - Add these values to your `.env.local` as shown above.
   - The app uses Cloudinary to store capsule images and retrieve their URLs, so you do not need to use Firebase Storage for images.
   - For more details, see `src/services/uploads.js` for the upload implementation.
6. **Run locally:**
   ```bash
   npm start
   ```
7. **Build for production:**
   ```bash
   npm run build
   ```
8. **Deploy:**
   ```bash
   firebase deploy
   ```

---

## Project Structure

```
art-capsules-store/
├── public/
├── src/
│   ├── admin/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── index.js
├── firebase.json
├── firestore.rules
├── package.json
└── README.md
```

---

## License

This project is licensed under the [MIT License](LICENSE).
