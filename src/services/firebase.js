import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

// Google sign-in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// Facebook sign-in
export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// Send email verification
export async function sendVerificationEmail(user) {
  await sendEmailVerification(user);
}

// Send password reset email
export async function sendResetPasswordEmail(email) {
  await sendPasswordResetEmail(auth, email);
}

const firebaseConfig = {
  apiKey: "AIzaSyBJfWbGgZ6sWR9THykNck4pk-LGC3LZamI",
  authDomain: "hotel-booking-16f5a.firebaseapp.com",
  projectId: "hotel-booking-16f5a",
  storageBucket: "hotel-booking-16f5a.appspot.com",
  messagingSenderId: "719219563016",
  appId: "1:719219563016:web:a344c47688dd4b61cfcfbd",
  measurementId: "G-B641MT9Z3B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { getStorage } from "firebase/storage";
export const storage = getStorage(app);

// Fetch hotels from Firestore
export async function fetchHotelsFromFirestore(searchQuery = "") {
  let q = collection(db, "hotels");
  // You can add filtering logic here if needed using query() and where()
  // For now, fetch all hotels
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Fetch a single hotel from Firestore by ID
export async function fetchSingleHotelFromFirestore(hotelId) {
  const docRef = doc(db, "hotels", hotelId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function signupUser(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
