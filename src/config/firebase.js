// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL2Yahm5SWaGdC1JJiIEElBNU9vxtHbwc",
  authDomain: "eduheaven-d4295.firebaseapp.com",
  projectId: "eduheaven-d4295",
  storageBucket: "eduheaven-d4295.appspot.com", // <-- fixed here
  messagingSenderId: "572164599334",
  appId: "1:572164599334:web:4baf7b87e51c29c92d40e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;