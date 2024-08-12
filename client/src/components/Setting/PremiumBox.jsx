import React, { useContext } from "react";
import { UserContext } from "../../UserContext";
import './setting.css';
// import Razorpay from 'razorpay';

const PremiumBox = ({ closePopup }) => {
  const { user, setUser } = useContext(UserContext);

  // const buyPremium = () => {
  //   const options = {
  //     key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
  //     amount: 9900, // Amount is in paise (₹99.00)
  //     currency: 'INR',
  //     name: 'TradeHere Premium',
  //     description: 'Purchase premium membership',
  //     image: 'https://example.com/your_logo', // Replace with your logo URL
  //     handler: function (response) {
  //       // Payment was successful, update user's premium status
  //       setUser({ ...user, premium: true });
  //       closePopup(); // Close the popup after payment
  //       alert('Payment successful! You are now a premium member.');
  //     },
  //     prefill: {
  //       name: user.name, // Prefill user's name
  //       email: user.email, // Prefill user's email
  //     },
  //     theme: {
  //       color: '#3399cc',
  //     },
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  const handlePremiumA = () =>{
    alert('⚠️ Work is in Progress')
  }

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
          <p>▶ AI-Based Stock Analytics & Predictions</p>
          <p>▶ AI Buddy to Talk About Trading</p>
        </div>

        <button id="buttonPre" onClick={() => handlePremiumA()} className="buy-button">
          Buy Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumBox;
