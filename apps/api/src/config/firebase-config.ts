import { env } from '@/env';
import { FirebaseOptions } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: env.FIREBASE_APIKEY,
  authDomain: env.FIREBASE_AUTHDOMAIN,
  projectId: env.FIREBASE_PROJECTID,
  storageBucket: env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: env.FIREBASE_MESSAGINGSENDERID,
  appId: env.FIREBASE_APPID,
};
