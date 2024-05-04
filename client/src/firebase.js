// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-98ef2.firebaseapp.com",
  projectId: "mern-auth-98ef2",
  storageBucket: "mern-auth-98ef2.appspot.com",
  messagingSenderId: "76427064585",
  appId: "1:76427064585:web:6bf2bd827d6bb8563c8fd8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
