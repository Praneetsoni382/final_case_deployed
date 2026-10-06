import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = null;

try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (err) {
  console.warn('Could not read firebase-applet-config.json:', err);
}

if (!firebaseConfig) {
  firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0301562606',
    apiKey: process.env.FIREBASE_API_KEY,
    firestoreDatabaseId: 'ai-studio-manmaker-579eff84-c7dd-40e7-ac48-3955f17dfc8b',
  };
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID from config
export const firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const firebaseApp = app;
