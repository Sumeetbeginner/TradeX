import React, { useContext, useEffect, useState } from "react";
import "./setting.css";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import userLogo from "../../assets/icons/trader.png";
import theme1 from "../../assets/images/theme1.png";
import theme2 from "../../assets/images/theme2.png";
import theme3 from "../../assets/images/theme3.png";

const Setting = () => {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [updatedUser, setUpdatedUser] = useState(user);
  const [usernameU, setUsernameU] = useState(user.username);
  const [emailU, setEmailU] = useState(user.email);

  useEffect(() => {
    console.log(updatedUser);
  }, [updatedUser]);

  const resetToDefault = () => {
    setEmailU(user.email);
    setUsernameU(user.username);
  };

  const updateUserData = () => {
    const newUserData = { ...updatedUser, username: usernameU, email: emailU };
    setUpdatedUser(newUserData);
    setUser(newUserData);
    console.log(newUserData);
    alert("✅ Profile Updated");
  };

  const changeThemeOfPage = (theme) => {

    const themeData = { ...updatedUser, theme : theme };
    setUpdatedUser(themeData);
    setUser(themeData);

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

  if (loading) return <div className="loader"></div>;

  return (
    <div className="settParent">
      <div className="personalDet">
        <div className="leftI2">
          <i
            onClick={() => navigate(-1)}
            className="fa-solid fa-arrow-left"
          ></i>

          {updatedUser ? (
            <div className="userInfoU">
              <img src={userLogo} alt="" />
              <p className="accUid">
                <span className="blueUid">Acc UID: </span>
                <span>{user.uid}</span>
              </p>
              <input
                onChange={(e) => {
                  setUsernameU(e.target.value);
                }}
                type="text"
                value={usernameU}
              />
              <input
                type="text"
                value={emailU}
                onChange={(e) => {
                  setEmailU(e.target.value);
                }}
              />
              <div className="balanceV">
                Balance: ₹{Number(user.balance).toFixed(2)}
              </div>
              <button className="resetDB" onClick={resetToDefault}>
                Reset to Default
              </button>
              <button onClick={updateUserData} className="updatePB">
                Update Profile
              </button>
            </div>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
      <div className="blockParentF">
        <div className="flexPF">
          <div className="flexPF1">Wallet Setting</div>
          <div className="flexPF1">Security</div>
        </div>
        <div className="flexPF">

          <div className="flexPF2">
            <h3>Change Theme</h3>
        <div className="flexBhaiA">
            <div className="flexThemeC">
              <img src={theme1} alt="" />
              <button className="selT2" onClick={() => changeThemeOfPage(1)}>
                Dark
              </button>
            </div>
            <div className="flexThemeC">
              <img src={theme2} alt="" />

              <button className="selT2" onClick={() => changeThemeOfPage(2)}>
                Light
              </button>
            </div>
            <div className="flexThemeC">
              <img src={theme3} alt="" />
              <button className="selT2" onClick={() => changeThemeOfPage(3)}>
                Aesthetic
              </button>
            </div>
            </div>
          </div>
          <div className="flexPF3">Other Icons</div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
