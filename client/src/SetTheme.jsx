import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const SetTheme = () => {
  const { user } = useContext(UserContext);
  const [theme, setTheme] = useState('')
  useEffect(() => {
    if(user){
     setTheme(user.theme)
    }
  }, [user])


  useEffect(() => {
    changeThemeOfPage(theme)
  }, [theme])

  const changeThemeOfPage = (theme) => {
    if (theme === 1) {
      document.documentElement.style.setProperty("--dark", "#14152a");
      document.documentElement.style.setProperty("--light", "#2f3046");
      document.documentElement.style.setProperty("--material", "#3a3fc5");
      document.documentElement.style.setProperty("--lmaterial", "#7479ff8b");
      document.documentElement.style.setProperty("--text", "#cccfd7");
      document.documentElement.style.setProperty("--red", "#ff4845");
      document.documentElement.style.setProperty("--green", "#07c456");
      document.documentElement.style.setProperty("--logo", "#0087f5");
    } else if (theme === 2) {
      document.documentElement.style.setProperty("--dark", "#BC9F8B");
      document.documentElement.style.setProperty("--light", "#E7E8D8");
      document.documentElement.style.setProperty("--material", "#088395");
      document.documentElement.style.setProperty("--lmaterial", "#F7B5CA");
      document.documentElement.style.setProperty("--text", "black");
      document.documentElement.style.setProperty("--red", "#A02334");
      document.documentElement.style.setProperty("--green", "#1ac465");
      document.documentElement.style.setProperty("--logo", "#6482AD");
    } else if (theme === 3) {
      document.documentElement.style.setProperty("--dark", "#FFAD60");
      document.documentElement.style.setProperty("--light", "#A02334");
      document.documentElement.style.setProperty("--material", "#36C2CE");
      document.documentElement.style.setProperty("--lmaterial", "#F7B5CA");
      document.documentElement.style.setProperty("--text", "black");
      document.documentElement.style.setProperty("--red", "#ff5959");
      document.documentElement.style.setProperty("--green", "#1ac465");
      document.documentElement.style.setProperty("--logo", "#6482AD");
    }
  };


//   useEffect(() => {
//     console.log(user);
    
//   }, [user])


  return <></>;
};

export default SetTheme;
