'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const apps = getApps();
  let app: FirebaseApp;
  
  if (apps.length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }

  // Use initializeFirestore to force long polling, which is more reliable in proxy/workstation environments
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  
  const auth = getAuth(app);

  return { app, db, auth };
}

export * from './provider';
export * from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
