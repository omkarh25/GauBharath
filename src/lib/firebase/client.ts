'use client';

/**
 * Firebase Client SDK singleton.
 *
 * Collections used by GauBharath are namespaced with `gaubharath_*` so they
 * live cleanly inside the Breathe project and can be exported and imported
 * into a dedicated project later without name conflicts.
 *
 * IMPORTANT: SDK instances are lazy. Importing this module never throws — even
 * if env vars are missing — so the app can still build & render the static
 * portions. Hooks that need Firebase will throw a friendly error on use.
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

/** Returns true only when every required public Firebase var is present. */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

let _app: FirebaseApp | null = null;
let _initTried = false;

/**
 * Lazily-initialised client app. Throws a helpful error if env vars are
 * missing so the page can surface it instead of crashing with a Vercel 404.
 */
function getClientApp(): FirebaseApp {
  if (_app) return _app;
  if (_initTried && !_app) {
    throw new Error(
      'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables in your Vercel project settings.',
    );
  }
  if (!isFirebaseConfigured()) {
    _initTried = true;
    throw new Error(
      'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables in your Vercel project settings.',
    );
  }
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _initTried = true;
  return _app;
}

/** Lazy getters — only initialise when first accessed at runtime. */
export function firebaseApp(): FirebaseApp {
  return getClientApp();
}
export function auth(): Auth {
  return getAuth(getClientApp());
}
export function db(): Firestore {
  return getFirestore(getClientApp());
}
export function storage(): FirebaseStorage {
  return getStorage(getClientApp());
}

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
