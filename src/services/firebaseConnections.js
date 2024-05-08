import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB38tcb0k6-IqlkwEYHaX_-qPcRGibwnTo",
  authDomain: "sync360-6855c.firebaseapp.com",
  projectId: "sync360-6855c",
  storageBucket: "sync360-6855c.appspot.com",
  messagingSenderId: "643507410284",
  appId: "1:643507410284:web:85a747c5b56ce4d0804f49",
  measurementId: "G-YF6PP88YBE",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export { auth, db, storage };
