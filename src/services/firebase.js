import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// Initialize reCAPTCHA for phone auth
export function setupRecaptcha(containerId = "recaptcha-container") {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      containerId,
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved
        },
      },
      auth
    );
  }
  return window.recaptchaVerifier;
}

// Send OTP to phone number
export async function sendPhoneOtp(phoneNumber) {
  const appVerifier = setupRecaptcha();
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

// Verify OTP code
export async function verifyPhoneOtp(confirmationResult, otp) {
  return await confirmationResult.confirm(otp);
}
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fetch hotels from Firestore
export async function fetchHotelsFromFirestore(searchQuery = "") {
  let q = collection(db, "hotels");
  // You can add filtering logic here if needed using query() and where()
  // For now, fetch all hotels
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
