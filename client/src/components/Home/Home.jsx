import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext.jsx';

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/welcome');
      }
    }
  }, [user, loading, navigate]);

  if(loading) return <div className="loader"></div>

  return (
    <div>
     Home
    </div>
  );
};

export default Home;
