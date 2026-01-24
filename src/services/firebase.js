// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClUeFf053HHIZhmJbi4Bzuioq2sc26fkQ",
  authDomain: "astrodate-c735b.firebaseapp.com",
  projectId: "astrodate-c735b",
  storageBucket: "astrodate-c735b.firebasestorage.app",
  messagingSenderId: "912123314404",
  appId: "1:912123314404:web:e49d2c8be8955e7ca1ecf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);