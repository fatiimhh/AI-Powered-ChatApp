import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIHWljJirhWvA7nKsy5ojH9kV30KEmZl0",
  authDomain: "rome-164e8.firebaseapp.com",
  projectId: "rome-164e8",
  storageBucket: "rome-164e8.firebasestorage.app",
  messagingSenderId: "876843043895",
  appId: "1:876843043895:web:cee21338a6e98751a983b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();