// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfTMydTE2BQmtsp1j5W-ZtOWFxJ8QIDag",
  authDomain: "connectme-e783f.firebaseapp.com",
  projectId: "connectme-e783f",
  storageBucket: "connectme-e783f.firebasestorage.app",
  messagingSenderId: "921171574641",
  appId: "1:921171574641:web:56a9b8ce576c5a5cf440d0",
  measurementId: "G-DBF6R11KMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };