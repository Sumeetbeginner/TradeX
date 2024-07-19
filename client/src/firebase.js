
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB6Oka0P9ecvXQvwX-NMZYylV5dmYiM61U",
    authDomain: "tradezone123.firebaseapp.com",
    databaseURL: "https://tradezone123-default-rtdb.firebaseio.com",
    projectId: "tradezone123",
    storageBucket: "tradezone123.appspot.com",
    messagingSenderId: "808869097364",
    appId: "1:808869097364:web:ee0b474383b5e85fb42981",
    measurementId: "G-QE5C3R05DM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
