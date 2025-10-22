import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'server-only';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

// Initialize Firebase for server-side
const app =
  getApps().find((app) => app.name === 'admin-app') ||
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'admin-app'
  );

const db = getFirestore(app);

export { app, db };
