// // Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgTP6vW55Cesm8H1PhSG1_1U9RfUeYn1U",
  authDomain: "travel-planner-d00fb.firebaseapp.com",
  projectId: "travel-planner-d00fb",
  storageBucket: "travel-planner-d00fb.firebasestorage.app",
  messagingSenderId: "532759461513",
  appId: "1:532759461513:web:7dd1c0d63cdea7cc815058",
  measurementId: "G-7TBGWCED4V"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// // 🔐 Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDgTP6vW55Cesm8H1PhSG1_1U9RfUeYn1U",
//   authDomain: "travel-planner-d00fb.firebaseapp.com",
//   projectId: "travel-planner-d00fb",
//   storageBucket: "travel-planner-d00fb.firebasestorage.app",
//   messagingSenderId: "532759461513",
//   appId: "1:532759461513:web:7dd1c0d63cdea7cc815058",
//   measurementId: "G-7TBGWCED4V"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);