// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase Config is from a web app project
// FOR KEEPING YOUR CONFIG IN A .env FILE
const apiKey = process.env.apiKey
const authDomain = process.env.authDomain
const databaseURL= process.env.databaseURL
const projectId = process.env.projectId
const storageBucket= process.env.storageBucket
const messagingSenderId= process.env.messagingSenderId
const appId= process.env.appId 
const measurementId = process.env.measurementId 

// ADD YOUR FIREBASE WEB APP CONFIG DATA BELOW

const firebaseConfig = {
  apiKey: apiKey, // 'api-key',
  authDomain: authDomain, // 'project-id.firebaseapp.com',
  databaseURL: databaseURL, //'https://project-id.firebaseio.com',
  projectId: projectId, //'project-id',
  storageBucket: storageBucket,// 'project-id.appspot.com',
  messagingSenderId: messagingSenderId, //'sender-id',
  appId: appId, // 'app-id',
  measurementId: measurementId //'G-measurement-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
const db = getFirestore(app);

export { app , auth, db }