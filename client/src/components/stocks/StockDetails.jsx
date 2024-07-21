import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext.jsx';
import './stocks.css'
import { useNavigate } from 'react-router-dom';

const StockInfo = () => {
  const { currStockData } = useContext(UserContext);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    const fetchStockInfo = async () => {
      if (!currStockData || !currStockData.SYMBOL) {
        navigate('/')
        setError('No stock selected');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/stockinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stockTicker: currStockData.SYMBOL })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setStockData(data);
        setError('');
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data. Please try again.');
        setStockData(null);
      }
    };

    fetchStockInfo();
  }, [currStockData]);

  useEffect(() => {
    console.log(currStockData);
  }, [currStockData])

  return (
    <div className='stockDBody'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stockData ? (
        <div className='stockDashboard'>
          
        </div>
      ) : (
        <div className='loader'></div>
      )}
    </div>
  );
};

export default StockInfo;
