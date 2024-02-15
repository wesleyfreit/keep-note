import { env } from '@/env';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: env.FIREBASE_APIKEY,
  authDomain: env.FIREBASE_AUTHDOMAIN,
  projectId: env.FIREBASE_PROJECTID,
  storageBucket: env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: env.FIREBASE_MESSAGINGSENDERID,
  appId: env.FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
