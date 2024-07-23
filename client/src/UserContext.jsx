import React, { createContext, useState, useEffect } from "react";
import { auth, database } from "./firebase.js";
import { ref, set, onValue, off } from "firebase/database";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = ref(database, `users/${userAuth.uid}`);

        const handleUserData = (snapshot) => {
          const userData = snapshot.val();
          setUser({ uid: userAuth.uid, ...userData });
        };

        onValue(userRef, handleUserData, {
          onlyOnce: true,
        });

        return () => off(userRef, "value", handleUserData);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSavedStock = (ticker) => {
    setUser((prevData) => {
      const savedStocks = prevData.savedStocks || [];
      const isSaved = savedStocks.includes(ticker);
      const updatedSavedStocks = isSaved
        ? savedStocks.filter((stock) => stock !== ticker)
        : [...savedStocks, ticker];

      return { ...prevData, savedStocks: updatedSavedStocks };
    });
  };

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      set(userRef, user).catch((error) => {
        console.error("Error updating user data:", error);
      });
    }
  }, [user]);

  const isStockSaved = (ticker) => {
    console.log(user);
    return user?.savedStocks?.includes(ticker) || false;
  };
  

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, toggleSavedStock, isStockSaved }}>
      {children}
    </UserContext.Provider>
  );
};
