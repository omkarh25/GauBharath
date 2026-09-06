/**
 * Firebase Admin SDK — used server-side only (API routes, server components).
 * Verifies ID tokens, reads/writes privileged data.
 *
 * Lazy init: we don't try to parse the private key at module load. This lets
 * `next build` succeed even when the placeholder key is still in .env.local.
 */
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0];
    return _app;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private key contains escaped newlines when read from .env
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey || privateKey.includes('REPLACE')) {
    throw new Error(
      'Missing or placeholder Firebase Admin credentials. Update .env.local with your service account key.',
    );
  }

  _app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return _app;
}

/** Lazy getters — only initialise when first accessed. */
export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}
export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

/** Verify a Firebase ID token from the Authorization header. */
export async function verifyIdToken(token: string) {
  return getAuth(getAdminApp()).verifyIdToken(token);
}

/** Same namespacing as the client SDK. */
export const ADMIN_COLLECTIONS = {
  products: 'gaubharath_products',
  thoughts: 'gaubharath_thoughts',
  orders: 'gaubharath_orders',
  settings: 'gaubharath_settings',
  admins: 'gaubharath_admins',
} as const;
