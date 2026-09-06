'use client';

/**
 * Firebase Client SDK singleton.
 *
 * Collections used by GauBharath are namespaced with `gaubharath_*` so they
 * live cleanly inside the Breathe project and can be exported and imported
 * into a dedicated project later without name conflicts.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Lazily-initialised client app. Avoids SSR initialisation issues. */
function getClientApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const firebaseApp = getClientApp();
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);

/**
 * Collection name constants. Keep these centralised so a future migration
 * to a dedicated project is a simple search-and-replace.
 */
export const COLLECTIONS = {
  products: 'gaubharath_products',
  thoughts: 'gaubharath_thoughts',
  orders: 'gaubharath_orders',
  settings: 'gaubharath_settings',
  admins: 'gaubharath_admins',
} as const;
