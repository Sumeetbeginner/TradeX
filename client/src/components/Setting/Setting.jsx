import React, { useContext, useEffect, useState } from "react";
import "./setting.css";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import userLogo from "../../assets/icons/trader.png";
import theme1 from "../../assets/images/theme1.png";
import theme2 from "../../assets/images/theme2.png";
import theme3 from "../../assets/images/theme3.png";
import SalaryBox from "./SalaryBox";
import PremiumBox from "./PremiumBox";

const Setting = () => {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [updatedUser, setUpdatedUser] = useState(user);
  const [usernameU, setUsernameU] = useState(user.username);
  const [emailU, setEmailU] = useState(user.email);
  const [showPremBox, setShowPremBox] = useState(false);
  const [editSalaryBox, setEditSalaryBox] = useState(false);
  const [passcode, setPasscode] = useState(user.passcode);
  const [prevPassCode, setPrevPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');

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
    const themeData = { ...updatedUser, theme: theme };
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

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  const editSalary = () => {
    if (user.premium == "false") {
      setShowPremBox(true);
      alert("No Premium");
    } else {
      setEditSalaryBox(true);
    }
  };

  const toggleP = () => {
    setEditSalaryBox(false);
    setShowPremBox(false);
  };

  const setPasscodeBro = () => {
    if (passcode == "unset") {
      setPasscode(newPasscode);
      setUser({ ...user, passcode: newPasscode });
      alert("✅ New Passcode Set");
    } else {
      if (Number(prevPassCode) == Number(passcode)) {
        setPasscode(newPasscode);
        setUser({ ...user, passcode: newPasscode });
        alert("✅ New Passcode Set");
        setNewPasscode("");
        setPrevPasscode("");
      } else {
        alert("⚠️ Incorrect Previous Passcode");
      }
    }
  };

  const unsetPasscode = () => {
    if (user.passcode !== "unset") {
      if (Number(prevPassCode) === Number(passcode)) {
        setUser({ ...user, passcode: "unset" });
        setPasscode("unset");
        alert("✅ Passcode is Now Unset");
      } else {
        alert("⚠️ Please Enter Previous Passcode");
      }
    } else {
      setUser({ ...user, passcode: "unset" });
      setPasscode("unset");
      alert("✅ Passcode is Now Unset");
    }
  };

  return (
    <div className="settParent">
      <div className="personalDet">
        <div className="leftI2">
          <i onClick={() => navigate(-1)} className="fa-solid fa-arrow-left"></i>

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
                Balance: ₹{formatNumber(Number(user.balance).toFixed(2))}
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
          <div className="flexPF1">
            <h2>Wallet</h2>

            <p>Balance : ₹{formatNumber(Number(user.balance).toFixed(2))}</p>
            <p>Salary : ₹{formatNumber(Number(user.salary))}/Month</p>

            <button onClick={() => editSalary()}>
              <i className="fa-solid fa-crown"></i> Edit Salary
            </button>
          </div>
          <div className="flexPF1">
            {" "}
            <h2>Security</h2>

            <div className="passcodeInp">
              {passcode == "unset" ? (
                <>
                  <p>⚠️ Enhance your Security by Setting your Passcode Now</p>{" "}
                  <input
                    className="unsetP"
                    onChange={(e) => {
                      setNewPasscode(e.target.value);
                    }}
                    type="text"
                    placeholder="Create a Passcode"
                  />{" "}
                </>
              ) : (
                <div className="setP">
                  <p>⚠️ Enhance your Security by Setting your Passcode Now</p>
                  <input
                    type="text"
                    onChange={(e) => {
                      setPrevPasscode(e.target.value);
                    }}
                    placeholder="Enter Previous Passcode"
                  />
                  <input
                    type="text"
                    onChange={(e) => {
                      setNewPasscode(e.target.value);
                    }}
                    placeholder="Create New Passcode"
                  />
                </div>
              )}
            </div>

            <button id="setPB" onClick={() => setPasscodeBro()}>
              Set Passcode
            </button>

            <p onClick={() => unsetPasscode()} className="removePasscode">
              Remove Passcode 🚫
            </p>
          </div>
        </div>
        <div className="flexPF">
          <div className="flexPF2">
            <h3>Change Theme</h3>
            <div className="flexBhaiA">
              <div className="flexThemeC">
                <img src={theme1} alt="" />
                <button className="selT2" onClick={() => changeThemeOfPage(1)}>
                  <i className="fa-solid fa-pen"></i> Select Theme
                </button>
              </div>
              <div className="flexThemeC">
                <img src={theme2} alt="" />
                <button className="selT2" onClick={() => changeThemeOfPage(2)}>
                  <i className="fa-solid fa-pen"></i> Select Theme
                </button>
              </div>
              <div className="flexThemeC">
                <img src={theme3} alt="" />
                <button className="selT2" onClick={() => changeThemeOfPage(3)}>
                  <i className="fa-solid fa-pen"></i> Select Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPremBox && <PremiumBox toggleP={toggleP} />}
      {editSalaryBox && <SalaryBox toggleP={toggleP} />}
    </div>
  );
};

export default Setting;
