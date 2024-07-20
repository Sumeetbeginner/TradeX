import React, { useLayoutEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext.jsx'; 

const Home = () => {
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!user) {
      navigate('/welcome');
    }
  }, [user, navigate]); 
  
  return (
    <div>Home</div>
  );
};

export default Home;
