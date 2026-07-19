// Firebase Configuration — Initializes Firebase app and exports Auth instance
// Used across the app for authentication (login, register, token generation)
// Handles initialization errors gracefully to prevent app crash on bad config

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase project configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  // Log warning but don't crash — app may still function for public pages
  console.warn('Firebase initialization failed:', error);
}

export { auth };
export default app;
