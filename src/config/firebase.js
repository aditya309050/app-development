import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Updated with the correct Web SDK configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF0Yj6aBm6wArZrkZTfJERx3DhMTcplCU",
  authDomain: "appdev-30620.firebaseapp.com",
  projectId: "appdev-30620",
  storageBucket: "appdev-30620.firebasestorage.app",
  messagingSenderId: "933015144535",
  appId: "1:933015144535:web:d9aa086fafb2793112bb12",
  measurementId: "G-9VPZY3KYQD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
