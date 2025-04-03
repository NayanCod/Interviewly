import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGz7L1AedgFGiEzUXLYMdqOFPBpUUtXnE",
  authDomain: "interviewly-b1985.firebaseapp.com",
  projectId: "interviewly-b1985",
  storageBucket: "interviewly-b1985.firebasestorage.app",
  messagingSenderId: "730492005800",
  appId: "1:730492005800:web:6473201683e74e6364819d",
  measurementId: "G-3Z6N7PQ9V2"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);