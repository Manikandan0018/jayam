import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ0w3_s3xYdWPoqKOacvx9NG4AFU15Hss",
  authDomain: "ecommerce-web-3de75.firebaseapp.com",
  projectId: "ecommerce-web-3de75",
  storageBucket: "ecommerce-web-3de75.firebasestorage.app",
  messagingSenderId: "542686283143",
  appId: "1:542686283143:web:e3dfb85b8831a877957f22",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
