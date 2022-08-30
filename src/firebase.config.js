// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDulgilVkXa0RsrLXAIs-WgFeu5JkpbCgM",
  authDomain: "house-marketplace-6e598.firebaseapp.com",
  projectId: "house-marketplace-6e598",
  storageBucket: "house-marketplace-6e598.appspot.com",
  messagingSenderId: "140923220563",
  appId: "1:140923220563:web:7599f58af0886bee9d4ca6",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
