/**
 * Seeds Firestore with the 17 products, 4 thoughts, and settings
 * defined in src/data/seed.ts. Uses the Firebase Admin SDK.
 *
 * Usage:
 *   npm run seed
 *
 * Requires FIREBASE_ADMIN_* env vars to be set in .env.local.
 */
import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { SEED_PRODUCTS, SEED_THOUGHTS, SEED_SETTINGS } from '../src/data/seed';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_ADMIN_* env vars. Fill them in .env.local first.');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

async function seedCollection<T extends { id?: string }>(name: string, items: T[]) {
  console.log(`Seeding ${name} (${items.length} docs)…`);
  const ref = db.collection(name);
  for (const item of items) {
    const { id, ...data } = item as T & { id?: string };
    const docId = id ?? ref.doc().id;
    await ref.doc(docId).set({ ...data, createdAt: Date.now(), updatedAt: Date.now() }, { merge: true });
    console.log(`  ✓ ${docId}`);
  }
}

async function main() {
  await seedCollection('gaubharath_products', SEED_PRODUCTS as any);
  await seedCollection('gaubharath_thoughts', SEED_THOUGHTS as any);
  await db.collection('gaubharath_settings').doc('site').set({ ...SEED_SETTINGS, updatedAt: Date.now() }, { merge: true });
  console.log('Settings saved.');
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
