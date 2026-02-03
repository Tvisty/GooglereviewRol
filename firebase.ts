import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// ------------------------------------------------------------------
// CONFIGURATION FROM FIREBASE CONSOLE
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyA8zhtMSFrHlRHuxfw-4bgln87Xby60dXY",
  authDomain: "reviewrolcris.firebaseapp.com",
  projectId: "reviewrolcris",
  storageBucket: "reviewrolcris.firebasestorage.app",
  messagingSenderId: "723132027495",
  appId: "1:723132027495:web:4a68bb3def2901e1677ac2",
  measurementId: "G-63M69J2G20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Helper to check if config is still default
export const isConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}