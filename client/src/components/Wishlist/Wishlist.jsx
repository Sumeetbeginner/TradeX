import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import "./wishlist.css";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { user, setUser } = useContext(UserContext);
  const [savedStock, setSavedStock] = useState(user.savedStocks || []);
  const [savedSData, setSavedSData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Stock Info of Ticker
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

    // Fetch All Saved Stock Info
    const updateSavedSData = async () => {
      const updatedData = await Promise.all(
        savedStock.map(async (stockTicker) => {
          const sdata = await fetchStockInfo(stockTicker);
          if (sdata) {
            // Calculate the absolute change in stock price
            let stockMoneyC =
              Number(sdata.result.currentPrice) -
              Number(sdata.result.previousClose);

            // Calculate the percentage change based on the opening price
            let stockPChange = (
              (stockMoneyC / Number(sdata.result.open)) *
              100
            ).toFixed(2);

            return {
              stockTicker,
              stockName: sdata.result.shortName,
              stockPrice: sdata.result.currentPrice,
              stockMoneyC: stockMoneyC.toFixed(2),
              stockPChange: Number(stockPChange).toFixed(2),
            };
          }
          return null;
        })
      );

      setSavedSData(updatedData.filter((stock) => stock !== null));
      setLoading(false);
      setInitialLoad(false);
    };

    // Run updateSavedSData every 5 seconds
    const intervalId = setInterval(() => {
      if (savedStock.length > 0) {
        updateSavedSData();
      }
    }, 5000);

    // Run updateSavedSData on initial load
    if (savedStock.length > 0) {
      updateSavedSData();
    }

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [savedStock]);

  // Remove Stock from wishlist and savedStock with the help of index
  const removeStock = (index) => {
    const updatedStocks = [...savedStock];
    updatedStocks.splice(index, 1);
    setSavedStock(updatedStocks);
    setUser((prevUser) => ({
      ...prevUser,
      savedStocks: updatedStocks,
    }));
  };

  // Open Clicked stock Info
  const openSInfo = (stockTicker) => {
    localStorage.setItem("currStockData", stockTicker);
    navigate("/stockinfo");
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="w100">
      {savedSData.length > 0 ? (
        <div className="parentS">
          {savedSData.map((stock, index) => (
            <div key={index} className="savedS">
              <div
                onClick={() => {
                  openSInfo(stock.stockTicker);
                }}
                className="savedSName"
              >
                {stock.stockName}
              </div>

              <div className="flexRS">
                <div className="savedSPrice">
                  ₹{Number(stock.stockPrice).toFixed(2)}
                </div>
                <div
                  className="savedSChange"
                  style={{
                    color: stock.stockMoneyC >= 0 ? "rgb(21, 169, 21)" : "red",
                  }}
                >
                  ₹{stock.stockMoneyC} ({stock.stockPChange}%)
                </div>

                <i
                  id="removeSaved"
                  onClick={() => {
                    removeStock(index);
                  }}
                  className="fa-solid fa-xmark"
                ></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="loader loaderkabhai"></div>
      )}
    </div>
  );
};

export default Wishlist;
