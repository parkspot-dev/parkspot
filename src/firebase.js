// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAvsZyGzx9hbS7IN4BgejdrCECmyRm1zxY',
    authDomain: 'parkspot-a4313.firebaseapp.com',
    databaseURL: 'https://parkspot-a4313-default-rtdb.firebaseio.com',
    projectId: 'parkspot-a4313',
    storageBucket: 'parkspot-a4313.appspot.com',
    messagingSenderId: '359490428715',
    appId: '1:359490428715:web:304aef16c6e99560012f6e',
    measurementId: 'G-82VNFQXCGR',
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export {
    firebase,
    getDatabase,
    ref,
    get,
    child,
    // dbref, pageData
    // app
};
