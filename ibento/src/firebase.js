import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCOyTO0Qzcw8oJ0n1FK4q8-3PUoaa9LzMY",
    authDomain: "ibento-campus-event-management.firebaseapp.com",
    projectId: "ibento-campus-event-management",
    storageBucket: "ibento-campus-event-management.firebasestorage.app",
    messagingSenderId: "660567504207",
    appId: "1:660567504207:web:b2f69b6c25c978785f813a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);