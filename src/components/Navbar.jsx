import { useState, useEffect } from "react";
import { auth, provider } from "../firebaseConfig"; // updated import
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google Sign-In error:", err);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-Out error:", err);
    }
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-indigo-600">Rome</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hi, {user.displayName}</span>
            <button
              onClick={handleSignOut}
              className="px-5 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all shadow-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}
