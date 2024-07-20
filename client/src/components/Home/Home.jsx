import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext.jsx';

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();


  return (
    <div className='rightE'>
     Home
    </div>
  );
};

export default Home;
