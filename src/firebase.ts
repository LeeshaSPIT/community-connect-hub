// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4B7JteWT0wH9Dgy2nRyFitUMUnAFDggE",
  authDomain: "community-connect-f9425.firebaseapp.com",
  projectId: "community-connect-f9425",
  storageBucket: "community-connect-f9425.firebasestorage.app",
  messagingSenderId: "785076540540",
  appId: "1:785076540540:web:2b84c8a00558ce1af025f9",
  measurementId: "G-NGGQWGNCMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);