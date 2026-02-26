'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase with specific optimizations for Cloud Workstation environments.
 * Forces long polling for Firestore to avoid WebSocket connectivity issues.
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
    // Attempt to initialize Firestore with forced long-polling
    // This is critical for reliability in proxy-heavy environments
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
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
