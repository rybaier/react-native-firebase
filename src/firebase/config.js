// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import log from '../components/logging_config'
import { APIKEY, AUTHDOMAIN, DATABASEURL, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID, MEASUREMENTID } from '@env'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase Config is for a Web APP


// FOR KEEPING YOUR CONFIG IN A .env FILE

log.debug('APIKEY', APIKEY)

const firebaseConfig = {
  apiKey: APIKEY, // 'api-key',
  authDomain: AUTHDOMAIN ,// 'project-id.firebaseapp.com',
  databaseURL: DATABASEURL, //'https://project-id.firebaseio.com',
  projectId: PROJECTID, //'project-id',
  storageBucket: STORAGEBUCKET,// 'project-id.appspot.com',
  messagingSenderId: MESSAGINGSENDERID, //'sender-id',
  appId: APPID, // 'app-id',
  measurementId: MEASUREMENTID, //'G-measurement-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
const db = getFirestore(app);

export { app , auth, db }