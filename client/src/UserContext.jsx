import React, { createContext, useState, useEffect } from "react";
import { auth, database } from "./firebase.js"; 
import { ref, set, onValue } from "firebase/database";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = ref(database, `users/${userAuth.uid}`);

        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUser({ uid: userAuth.uid, ...userData });
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      set(userRef, user);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
