import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDk3AJGHNG5G3sQXrNXPPbPM50TGwFMhAo",
	authDomain: "house-marketplace-app-c8fe6.firebaseapp.com",
	projectId: "house-marketplace-app-c8fe6",
	storageBucket: "house-marketplace-app-c8fe6.appspot.com",
	messagingSenderId: "309279924945",
	appId: "1:309279924945:web:a7a3c0fdbc820410005bf0",
	measurementId: "G-Y03TLMTMJL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
