import React, { useContext } from "react";
import { UserContext } from "../../UserContext";
import './setting.css'

const PremiumBox = ({ closePopup }) => {
  const { user, setUser } = useContext(UserContext);

  const buyPremium = () => {};

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="topBuy">
          <h2 id="premHead">Buy Premium</h2>
          <i id="closeP" onClick={closePopup} className="fa-solid fa-xmark"></i>
        </div>

        <div className="premiumD">
          <h3>Extra Premium Features</h3>

          <p>▶ Decide your Own Salary Per Month </p>
          <p>▶ AI Based Stock Analytics & Predictions</p>
          <p>▶ AI Buddy to Talk About Trading</p>
        </div>

        <button id="buttonPre" onClick={() => buyPremium()} className="buy-button">
          Buy Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumBox;
