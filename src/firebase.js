import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";

// ... existing code ...

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtD8c8-4OVawvkLqp9qV-hc0HWx5k40a8",
  authDomain: "fir-chat-app-bbe20.firebaseapp.com",
  projectId: "fir-chat-app-bbe20",
  storageBucket: "fir-chat-app-bbe20.appspot.com",
  messagingSenderId: "804129915452",
  databaseURL:
    "https://fir-chat-app-bbe20-default-rtdb.asia-southeast1.firebasedatabase.app",
  appId: "1:804129915452:web:7d78471d7b0e96091cf939",
  measurementId: "G-CD74B22Z65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);

export const updateUserStatus = (userId, isOnline) => {
  const userStatusRef = ref(database, `users/${userId}`);
  set(userStatusRef, {
    online: isOnline,
    lastSeen: serverTimestamp(),
  });
};

export const setupPresence = (userId) => {
  const userStatusRef = ref(database, `users/${userId}`);
  set(userStatusRef, { online: true, lastSeen: serverTimestamp() });
  onDisconnect(userStatusRef).set({
    online: false,
    lastSeen: serverTimestamp(),
  });
};
