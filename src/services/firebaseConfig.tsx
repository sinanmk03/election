// src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXGz-Q1xg4x2F3NhocOB0_RNsrJOLwUYs",
  authDomain: "voting-system-468bf.firebaseapp.com",
  projectId: "secure-voting-system",
  // No need for storageBucket if not using Firebase Storage
  messagingSenderId: "415598780631",
  appId: "1:415598780631:web:e16ec4b78af1ca53811092",
};

const app = initializeApp(firebaseConfig);

/** Export the Firestore DB if you want to store candidate data off-chain. */
export const db = getFirestore(app);
