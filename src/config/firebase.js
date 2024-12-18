import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSBfME_B7O8lhQBEB9wozRnI1-RigWpjE",
  authDomain: "razaku-e7928.firebaseapp.com",
  projectId: "razaku-e7928",
  storageBucket: "razaku-e7928.appspot.com",
  messagingSenderId: "1079183492447",
  appId: "1:1079183492447:web:96ea4bee91dd175772a2ea" // Fix the appId format
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Simplify persistence setup
setPersistence(auth, browserLocalPersistence);

export { db, auth };