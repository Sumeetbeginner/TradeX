
import React, {useContext, useEffect, useLayoutEffect} from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; 
import Home from './components/Home/Home';
import Welcome from './components/Welcome/Welcome';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Portfolio from './components/Portfolio/Portfolio';
import Wishlist from './components/Wishlist/Wishlist';
import Profile from './components/Profile/Profile';
import Setting from './components/Setting/Setting';
import Wallet from './components/Wallet/Wallet';
import { UserContext } from './UserContext.jsx';
import Search from './components/Search/Search.jsx';
import StockDetails from './stocks/StockDetails.jsx';


const Main2 = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const noNavbarPaths = ['/welcome', '/signup', '/login', '/setting', '/profile', '/stockinfo'];
  const { user, loading } = useContext(UserContext);


  if(loading) return <div className="loader"></div>

  return (
    <>
    <div className="flexParent">
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/wallet' element={<Wallet />} />
        <Route path='/search' element={<Search />} />
        <Route path='/stockinfo' element={<StockDetails />} />
      </Routes>
      </div>
    </>
  );
};

export default Main2;
