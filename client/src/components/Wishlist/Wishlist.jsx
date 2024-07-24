import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import './wishlist.css'

const Wishlist = () => {
  const { user, setUser } = useContext(UserContext);
  const [savedStock, setSavedStock] = useState(user.savedStocks || []);
  const [savedSData, setSavedSData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSavedStock(user.savedStocks || []);
  }, [user]);

  useEffect(() => {
    const fetchStockInfo = async (savedS) => {
      try {
        const response = await fetch("http://localhost:3000/stockinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockTicker: savedS }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
      }
    };

    const updateSavedSData = async () => {
      setLoading(true);
      const updatedData = await Promise.all(savedStock.map(async (stockTicker) => {
        const sdata = await fetchStockInfo(stockTicker);
        if (sdata) {
          const stockMoneyC = Number(sdata.result.currentPrice) - Number(sdata.result.open);
          const stockPChange = ((stockMoneyC / Number(sdata.result.open)) * 100).toFixed(2);

          return {
            stockTicker,
            stockName: sdata.result.shortName,
            stockPrice: sdata.result.currentPrice,
            stockMoneyC: stockMoneyC.toFixed(2),
            stockPChange: Number(stockPChange).toFixed(2),
          };
        }
        return null;
      }));

      // Filter out any null values if fetch failed
      setSavedSData(updatedData.filter(stock => stock !== null));
      setLoading(false);
    };

    if (savedStock.length > 0) {
      updateSavedSData();
    }
  }, [savedStock]);

      
  const removeStock = (index) => {
    const updatedStocks = [...savedStock];
    updatedStocks.splice(index, 1);
    setSavedStock(updatedStocks);
    setUser((prevUser) => ({
      ...prevUser,
      savedStocks: updatedStocks
    }));
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className='w100'>
      {savedSData.length > 0 ? (
        <div className='parentS'>
          {savedSData.map((stock, index) => (
            <div key={index} className='savedS'>
              <div className="savedSName">{stock.stockName}</div>

              <div className='flexRS'>
              <div className="savedSPrice">₹{stock.stockPrice}</div>
              <div className="savedSChange" style={{ color: stock.stockMoneyC >= 0 ? 'rgb(21, 169, 21)' : 'red' }}>
                ₹{stock.stockMoneyC} ({stock.stockPChange}%)
              </div>

              <i id='removeSaved' onClick={() => {removeStock(index)}} className="fa-solid fa-xmark"></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved stocks found</p>
      )}
    </div>
  );
};

export default Wishlist;
