
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB5c60e1K7GPD8wC0K9g3ZQG2kWois2AfQ",
  authDomain: "chattingapp-1d5ba.firebaseapp.com",
  projectId: "chattingapp-1d5ba",
  storageBucket: "chattingapp-1d5ba.firebasestorage.app",
  messagingSenderId: "14213628565",
  appId: "1:14213628565:web:c5af9f1cb63546d079119c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const analytics = getAnalytics(app)

export default app
export { auth }






