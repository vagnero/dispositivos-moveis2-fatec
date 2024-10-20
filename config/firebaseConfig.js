// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAY2ZljVEowc60OzhboVXyK3neSy15Z14w",
    authDomain: "login-a7dd1.firebaseapp.com",
    projectId: "login-a7dd1",
    storageBucket: "login-a7dd1.appspot.com",
    messagingSenderId: "687872514260",
    appId: "1:687872514260:web:fe354f85f2b4b0b43cc341",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
