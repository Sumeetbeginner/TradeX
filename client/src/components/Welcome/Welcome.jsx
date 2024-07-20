import React, { useState, useEffect } from "react";
import "./welcome.css";
import appLogo from "../../assets/icons/appLogo.png";
import { useNavigate } from "react-router-dom";
import illu1 from "../../assets/images/illu1.png";
import illu2 from "../../assets/images/illu2.png";
import illu3 from "../../assets/images/illu3.png";

const Welcome = () => {
  const location = useNavigate();
  const [loading, setLoading] = useState(true);
  const [illC, setIllC] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, []);

  const nextSlide = () => {
    if(illC < 2){
      setIllC(illC + 1);
    }
    if(illC == 1){
      btnN.innerHTML = "Register"
    }
    if(illC == 2){
      location('/signup')
    }
  }
  const prevSlide = () => {
    if(illC > 0){
      setIllC(illC - 1);
      btnN.innerHTML = "Next"
    }
    
  }

  if (loading) return <div className="loader"></div>;

  return (
    <>
    <div>
      <div className="top-full">
        <div className="flex-center">
          <h1>Trade</h1>
          <img className="t-med-img" src={appLogo} alt="App Logo" />
        </div>
      </div>
      <div className="slide-container">
        {illC === 0 && (
          <div className="slide-flex">
            <img src={illu1} alt="" />

            <div className="introP">
              <h2>
                Play Real-time Indian Stock Market with Virtual Money and Learn
              </h2>
              <p>
                Dive into the world of stock trading with our platform. Use
                virtual money to trade in real-time and enhance your financial
                acumen without any risk. Perfect for beginners and enthusiasts
                looking to learn and practice.
              </p>
            </div>
          </div>
        )}
        {illC === 1 && (
          <div className="slide-flex">
            <img src={illu2} alt="" />

            <div className="introP">
              <h2>
                Real-like Simulated Trading Platform with Portfolio and
                Real-time Sharing Updates
              </h2>
              <p>
                Our platform provides a realistic trading experience with a
                comprehensive portfolio management system. Stay updated with
                real-time market data and trade like a pro. Track your
                investments and see how your portfolio performs just like in
                real-life trading.
              </p>
            </div>
          </div>
        )}
        {illC === 2 && (
          <div className="slide-flex">
            <img src={illu3} alt="" />

            <div className="introP">
              <h2>Monthly Virtual Money Credited as a Salary</h2>
              <p>
                Receive a virtual salary each month to your trading account
                This allows you to continuously
                engage in trading activities, strategize, and improve your
                skills over time. Keep the momentum going with fresh virtual
                funds every month.
              </p>
            </div>
          </div>
        )}

        <div className="flex-btn">
          <button onClick={prevSlide} className="prev-button">
            Previous
          </button>
          <button onClick={nextSlide} id="btnN" className="next-button">
            Next
          </button>
        </div>
      </div>

      <div className="footer">
        <div className="animationP">
          <p>
            <span className="s">TCS : </span>
            <span className="p td">₹4,298.00<i class="fa-solid fa-arrow-trend-down"></i></span>
          </p>
          <p>
            <span className="s">Infosys : </span>
            <span className="p tu">₹1,789.35<i class="fa-solid fa-arrow-trend-up"></i></span>
          </p>
          <p>
            <span className="s">Just Dial LTD : </span>
            <span className="p tu">₹1,250.00<i class="fa-solid fa-arrow-trend-up"></i></span>
          </p>
          <p>
            <span className="s">Reliance Industries Ltd : </span>
            <span className="p td">₹3,116.95<i class="fa-solid fa-arrow-trend-down"></i></span>
          </p>
          <p>
            <span className="s">ITC LTD : </span>
            <span className="p tu">₹473.15<i class="fa-solid fa-arrow-trend-up"></i></span>
          </p>
          <p>
            <span className="s"> State Bank of India : </span>
            <span className="p td">₹889.50<i class="fa-solid fa-arrow-trend-down"></i></span>
          </p>
          <p>
            <span className="s">Axis Bank Ltd </span>
            <span className="p td">₹1,293.80<i class="fa-solid fa-arrow-trend-down"></i></span>
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Welcome;
