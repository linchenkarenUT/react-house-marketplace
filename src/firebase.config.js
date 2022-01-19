import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoOWXHeEQ-s-qWrelJC6NaXOj6QrUW1xA",
  authDomain: "house-marketplace-app-e37e3.firebaseapp.com",
  projectId: "house-marketplace-app-e37e3",
  storageBucket: "house-marketplace-app-e37e3.appspot.com",
  messagingSenderId: "649891669168",
  appId: "1:649891669168:web:e5380d19f60c31a4bf4775"
};

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
