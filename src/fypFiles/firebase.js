// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEA5aWkor7sqrYpPgAqkooWQL7RIAoEjA",
  authDomain: "messenger-app-cf16c.firebaseapp.com",
  databaseURL: "https://messenger-app-cf16c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "messenger-app-cf16c",
  storageBucket: "messenger-app-cf16c.appspot.com",
  messagingSenderId: "988846242174",
  appId: "1:988846242174:web:41f7f52152810a804e9b2f",
  measurementId: "G-04L3X90QXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app) 