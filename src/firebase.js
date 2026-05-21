import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQlAfC4wlJsXJ9-3FPMyA0CXIv57gL3Nw",
  authDomain: "fitness-d8529.firebaseapp.com",
  projectId: "fitness-d8529",
  storageBucket: "fitness-d8529.firebasestorage.app",
  messagingSenderId: "243945908124",
  appId: "1:243945908124:web:7e032218f834fb58e34a59",
  measurementId: "G-HESK25GQFZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;