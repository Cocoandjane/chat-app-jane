

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth  } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = getFirestore(app);
export { db };
export const storage = getStorage(app)

export default app
