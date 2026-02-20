import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          // 🔥 Fetch user document from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(docRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setRole(data.role || null);
            setClubId(data.clubId || null);
            setFullName(data.fullName || null);
          } else {
            setRole(null);
            setClubId(null);
            setFullName(null);
          }

        } catch (error) {
          console.error("Error fetching user data:", error);
        }

      } else {
        setUser(null);
        setRole(null);
        setClubId(null);
        setFullName(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        clubId,
        fullName,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}