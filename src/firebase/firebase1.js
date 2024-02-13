// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFHuYDLOLj6I8nYUtKWXunPsv04hRCyX4",
  authDomain: "clinicpet-9e489.firebaseapp.com",
  projectId: "clinicpet-9e489",
  storageBucket: "clinicpet-9e489.appspot.com",
  messagingSenderId: "419285370023",
  appId: "1:419285370023:web:7e8ce50362f872e949c782"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {auth};