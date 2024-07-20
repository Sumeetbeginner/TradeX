import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext.jsx";
import appLogo from "../../assets/icons/appLogo.png";
import "./navbar.css";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation(); 
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navBarE">
      <div className="topAppL">
        <h1>Trade</h1>
        <img src={appLogo} alt="App Logo" />
      </div>

      <h2 id="navG">Welcome, <span>{user.username}</span></h2>

      <div className="navEle">
        
        <div  onClick={() => navigate('/')} className={`navEleL ${isActive('/') ? 'active' : ''}`} id="navHome">
          <i className="fas fa-home"></i>
          <h2>Home</h2>
        </div>

        <div onClick={() => navigate('/search')} className={`navEleL ${isActive('/search') ? 'active' : ''}`} id="navSearch">
          <i className="fa-solid fa-search"></i>
          <h2>Search</h2>
        </div>

        <div onClick={() => navigate('/portfolio')} className={`navEleL ${isActive('/portfolio') ? 'active' : ''}`} id="navPf">
          <i className="fa-solid fa-briefcase"></i>
          <h2>Portfolio</h2>
        </div>

        <div onClick={() => navigate('/wishlist')} className={`navEleL ${isActive('/wishlist') ? 'active' : ''}`} id="navWl">
          <i className="fa-solid fa-bookmark"></i>
          <h2>Wishlist</h2>
        </div>

        <div onClick={() => navigate('/wallet')} className={`navEleL ${isActive('/wallet') ? 'active' : ''}`} id="navWallet">
          <i className="fa-solid fa-wallet"></i>
          <h2>Wallet</h2>
        </div>
      </div>

      <div className="flexLastB">
        <i className="fa-solid fa-power-off"></i>
        <i onClick={() => navigate('/setting')} className="fa-solid fa-gear"></i>
      </div>
    </div>
  );
};

export default Navbar;
