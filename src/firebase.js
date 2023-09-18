// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

// initialize firebase auth
const auth = getAuth(firebase);

/**
 * getValueFromFirebase returns the value at the path. Value can be a JSON 
 * object or primitive data.
 *
 * @param {String} path: complete path to the node starting from root.
 */
async function getValueFromFirebase(path) {
    const res = await get(child(ref(getDatabase(firebase)), path));
    return await res.val();
}

export { auth, getValueFromFirebase };
