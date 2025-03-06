import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAI-zk5Trivco0ZGTLHLEe3FhJGVtfQuQM",
  authDomain: "nomnombox-8bf47.firebaseapp.com",
  projectId: "nomnombox-8bf47",
  storageBucket: "nomnombox-8bf47.firebasestorage.app",
  messagingSenderId: "1059298931718",
  appId: "1:1059298931718:web:4aee9c812811194daaff87",
  measurementId: "G-JRKKFCWMHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }));
  } else {
    // User is signed out
    localStorage.removeItem('user');
  }
});

export { auth, db, googleProvider, signInWithPopup, analytics }; 