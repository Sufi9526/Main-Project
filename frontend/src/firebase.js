// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-RE0q05UlKwo6RIHV1T_4IGbg-RCg0n4",
  authDomain: "travel-planner-34157.firebaseapp.com",
  projectId: "travel-planner-34157",
  storageBucket: "travel-planner-34157.firebasestorage.app",
  messagingSenderId: "734441741681",
  appId: "1:734441741681:web:bc11f3cdab3cce9db5aad0",
  measurementId: "G-TZDLWKBZ7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔐 Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;