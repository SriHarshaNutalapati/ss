// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXY7cht7Tw--GCL-WBzHO3G4V1nfTx00g",
  authDomain: "seoulspice-c18ca.firebaseapp.com",
  projectId: "seoulspice-c18ca",
  storageBucket: "seoulspice-c18ca.appspot.com",
  messagingSenderId: "256383650567",
  appId: "1:256383650567:web:6a84265103fb18ec9213a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};