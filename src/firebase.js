import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyBngNyiabXI0RrCox5ygNumgW7oadl5eQM",
    authDomain: "react-ff86f.firebaseapp.com",
    projectId: "react-ff86f",
    storageBucket: "react-ff86f.appspot.com",
    messagingSenderId: "779192589687",
    appId: "1:779192589687:web:fae1f8be546ab281ced572",
    measurementId: "G-566YZL3XH2"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };