# Frame Vist Capsules

This storefront + admin console runs on Firebase (Firestore, Auth, Storage) with real-time catalogue editing, checkout logging, and instant download bundles.

## Environment configuration

Create a `.env` file with the Firebase keys:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

REACT_APP_CLOUDINARY_CLOUD_NAME=...
REACT_APP_CLOUDINARY_UPLOAD_PRESET=...
```

The checkout flow automatically formats capsule metadata pulled from Firestore (story, prompt, resolutions, etc.) and packages everything into the download bundle a collector receives immediately after purchase.

## Collector emails

Checkout now collects a required email address for every order. Each submission is saved inside the `collectorEmails` Firestore collection with the customer's name, email, related order ID, and a timestamp. Admins can review the latest entries inside the dashboard to export or contact collectors, while writes remain open to the storefront checkout so purchases can complete without authentication.

## Image uploads

The admin dashboard can upload images directly to Cloudinary (or any compatible unsigned upload endpoint). Provide a Cloudinary **unsigned upload preset** and the **cloud name** via the environment variables above. Uploaded images immediately populate the corresponding URL fields (main image, gallery entries, and variations), so you no longer need to paste external URLs manually.

## Instant downloads

During checkout, the app:

1. Writes an order record to Firestore (with customer info and purchased items).
2. Increments each capsule's `stats.purchases` value for analytics.
3. Generates a `.zip` archive on the client using JSZip, containing:
   - `metadata.json` for every capsule (title, story, prompt, etc.).
   - Primary artwork plus gallery/variation images.
   - Each resolution URL attached in the admin form.
4. Saves the archive to the collector's device with the pattern `frame-vist-order-<id>.zip`.

Because the download happens inside the browser, make sure the capsule asset URLs (gallery, variations, resolutions) are publicly accessible and properly CORS-enabled.

# Getting Started with Create React App

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
