import { firebase } from 'firebase';
import { firebaseui } from 'firebaseui ';

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());