'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with optimizations for Cloud Workstation environments.
 * 1. Forces long polling to bypass WebSocket proxy issues.
 * 2. Uses memory-only cache to prevent persistent disk-lock errors.
 */
export function initializeFirebase() {
  const apps = getApps();
  let app: FirebaseApp;
  
  if (apps.length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }

  let db: Firestore;
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    db = getFirestore(app);
  }
  
  const auth = getAuth(app);

  return { app, db, auth };
}

export * from './provider';
export * from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
