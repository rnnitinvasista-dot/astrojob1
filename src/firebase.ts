import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCL4jzyzDn8fA5QkL949n9mMQ9V3AAOvNA",
    authDomain: "astrojob-f0918.firebaseapp.com",
    projectId: "astrojob-f0918",
    storageBucket: "astrojob-f0918.firebasestorage.app",
    messagingSenderId: "548413141033",
    appId: "1:548413141033:web:927b95af1d97e3e03dec38",
    measurementId: "G-57JN715DKL"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { firebaseConfig, app, analytics, auth, db };
export default app;
