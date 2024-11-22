import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSBfME_B7O8lhQBEB9wozRnI1-RigWpjE",
  authDomain: "razaku-e7928.firebaseapp.com",
  projectId: "razaku-e7928",
  storageBucket: "razaku-e7928.appspot.com",
  messagingSenderId: "1079183492447",
  appId: "1:1079183492447web:96ea4bee91dd175772a2ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}