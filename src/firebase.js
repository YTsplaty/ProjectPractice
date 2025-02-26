// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxcARVYruBuVwoMNpUCNYj1VitNlY0pxc",
    authDomain: "projectpractice-a89e4.firebaseapp.com",
    projectId: "projectpractice-a89e4",
    storageBucket: "projectpractice-a89e4.firebasestorage.app",
    messagingSenderId: "576183411873",
    appId: "1:576183411873:web:a3ddcb8c6503b06eff3ce0",
    measurementId: "G-LFKWSBWQ6W"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);



