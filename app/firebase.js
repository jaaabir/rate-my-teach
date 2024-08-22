
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH2bnEsqjBOyclcaOY-lnztlu6x2PVqOs",
  authDomain: "ratemyprofessor-dd601.firebaseapp.com",
  projectId: "ratemyprofessor-dd601",
  storageBucket: "ratemyprofessor-dd601.appspot.com",
  messagingSenderId: "469482476266",
  appId: "1:469482476266:web:88e11ae89d13786525fd93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
