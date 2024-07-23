import React, { createContext, useState, useEffect } from "react";
import { auth, database } from "./firebase.js";
import { ref, set, onValue, off } from "firebase/database";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated or not and if yes it retrieves data from firebase and store it in user
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

  //Updates user in firebase everytime the the user data changes
  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      set(userRef, user).catch((error) => {
        console.error("Error updating user data:", error);
      });
    }
  }, [user]);

  // Wait until data is retrieved from firebase
  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  // Check if ticker exists in savedStock or not
  const isStockSaved = (ticker) => {
    console.log(user);
    return user?.savedStocks?.includes(ticker) || false;
  };

  // Handle Stock (Add or Remove Stocks from savedStocks)
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

  return (
    <UserContext.Provider value={{ user, setUser, loading, toggleSavedStock, isStockSaved }}>
      {children}
    </UserContext.Provider>
  );
};
