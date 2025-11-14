// firebaseConfig.js

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrbyx4BKxS3Z-498jGbE_Wmlu5QstZmso",
  authDomain: "splitwiser-d5b38.firebaseapp.com",
  projectId: "splitwiser-d5b38",
  storageBucket: "splitwiser-d5b38.firebasestorage.app",
  messagingSenderId: "161810619556",
  appId: "1:161810619556:android:e938349fec760770b35a31"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});