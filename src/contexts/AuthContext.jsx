import { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Sign-In (for Normal Users)
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const loggedInUser = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL || "/default-avatar.png",
        uid: result.user.uid,
        role: "user",
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Admin Email/Password Login
  const loginAsAdmin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Here you can add check for specific admin email(s)
      const isAdminEmail = ["admin@aura.com", "superadmin@gmail.com"].includes(
        result.user.email
      );

      if (!isAdminEmail) {
        alert("Access Denied: You are not an admin.");
        await signOut(auth);
        return;
      }

      const adminUser = {
        displayName: "Admin",
        email: result.user.email,
        photoURL: result.user.photoURL || "/admin-avatar.png",
        uid: result.user.uid,
        role: "admin",
      };

      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
    } catch (error) {
      console.error("Admin Login Error:", error);
      alert("Invalid admin credentials");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Persist session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
      } else if (currentUser) {
        const defaultUser = {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL || "/default-avatar.png",
          uid: currentUser.uid,
          role: "user",
        };
        setUser(defaultUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loginWithGoogle, loginAsAdmin, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
