'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with specific optimizations for Cloud Workstation environments.
 * 1. Forces long polling to avoid WebSocket proxy issues.
 * 2. Uses memory-only cache to prevent disk-lock issues in the development environment.
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
    // We use initializeFirestore to configure specific settings for stability
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true, // Crucial for proxy/workstation environments
      localCache: memoryLocalCache(),      // Use memory cache to avoid persistence errors
    });
  } catch (e) {
    // If already initialized, get the existing instance
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
