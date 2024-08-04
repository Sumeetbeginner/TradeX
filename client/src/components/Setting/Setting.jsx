import React, { useContext, useEffect, useState } from "react";
import "./setting.css";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import userLogo from "../../assets/icons/trader.png";

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
    alert("✅ Profile Updated")
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
          <div className="flexPF2">Theme</div>
          <div className="flexPF3">Other Icons</div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
