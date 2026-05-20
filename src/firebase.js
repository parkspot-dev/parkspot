import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

// Firebase SDKs reach for `window` / `document` / `IndexedDB` during init.
// Under SSR (`vite-ssg build` / `@vue/server-renderer`) none of those exist,
// so we lazy-initialize on first use and short-circuit on the server.
const isBrowser = typeof window !== 'undefined';

let firebaseApp = null;

function getFirebaseApp() {
    if (!isBrowser) {
        return null;
    }
    if (!firebaseApp) {
        firebaseApp = initializeApp(firebaseConfig);
    }
    return firebaseApp;
}

/**
 * Browser-only Firebase Auth handle. On the server we expose a tiny stub that
 * satisfies the `onAuthStateChanged(auth, ...)` contract so consumers can be
 * imported safely during SSR without doing their own typeof-window checks.
 */
const serverAuthStub = {
    currentUser: null,
};

export const auth = isBrowser ? getAuth(getFirebaseApp()) : serverAuthStub;

/**
 * Reads a value at `path` in Firebase RTDB. Returns `null` on the server (we
 * don't need RTDB during SSR rendering — build-time data flows through
 * `src/utils/seo/rtdb-build.js`, which uses the REST API instead of the SDK).
 *
 * @param {string} path Slash-separated RTDB path, root-relative.
 * @returns {Promise<*>}
 */
export async function getValueFromFirebase(path) {
    if (!isBrowser) {
        return null;
    }
    const app = getFirebaseApp();
    const res = await get(child(ref(getDatabase(app)), path));
    return await res.val();
}
