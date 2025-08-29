import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2MZkkZJCvqyL1c4n5b41YyqAR496zBQ8",
  authDomain: "expense-tracker-14326.firebaseapp.com",
  projectId: "expense-tracker-14326",
  storageBucket: "expense-tracker-14326.firebasestorage.app",
  messagingSenderId: "814739884600",
  appId: "1:814739884600:android:31a6019035cc37ee06f4cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);
