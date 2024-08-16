import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";
import "./mwl.css";

const Wishlist = () => {
  const { user, setUser } = useContext(UserContext);
  const [savedStock, setSavedStock] = useState(user.savedStocks || []);
  const [savedSData, setSavedSData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Check if the current time is within market hours (Monday to Friday, 9:15 AM to 3:30 PM)
  const isMarketOpen = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hours = now.getHours();
    const minutes = now.getMinutes();

    return (
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      ((hours > 9 || (hours === 9 && minutes >= 15)) &&
       (hours < 15 || (hours === 15 && minutes <= 30)))
    );
  };

  // Function to fetch stock info
  const fetchStockInfo = async (savedS) => {
    try {
      const response = await fetch("https://tradexservers.vercel.app/stockinfo", {
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

  // Fetch all saved stock info
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
  };

  useEffect(() => {
    // Fetch data on component mount
    if (savedStock.length > 0) {
      updateSavedSData();
    }

    let intervalId;

    // Polling function
    const startPolling = () => {
      if (isMarketOpen()) {
        intervalId = setInterval(() => {
          if (isMarketOpen()) {
            updateSavedSData();
          }
        }, 10000); // Fetch data every 10 seconds
      } else {
        clearInterval(intervalId); // Clear interval if market is closed
      }
    };

    startPolling();

    // Schedule polling to start at the beginning of market hours
    const now = new Date();
    const msUntilNextOpen = new Date(now.setHours(9, 15, 0, 0)).getTime() - Date.now();
    const msUntilClose = new Date(now.setHours(15, 30, 0, 0)).getTime() - Date.now();

    if (msUntilNextOpen > 0 && msUntilNextOpen < msUntilClose) {
      setTimeout(startPolling, msUntilNextOpen);
    }

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [savedStock]);

  // Remove stock from wishlist and savedStock with the help of index
  const removeStock = (index) => {
    const updatedStocks = [...savedStock];
    updatedStocks.splice(index, 1);
    setSavedStock(updatedStocks);
    setUser((prevUser) => ({
      ...prevUser,
      savedStocks: updatedStocks,
    }));
  };

  // Open clicked stock info
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
          {savedSData
            .slice()
            // .reverse()
            .map((stock, index) => (
              <div key={index} className="savedS">
                <div
                  onClick={() => {
                    openSInfo(stock.stockTicker);
                  }}
                  className="savedSName"
                >
                  <span className="stockNW">{stock.stockName}</span>
                  <span className="stockTW">{stock.stockTicker}</span>
                </div>

                <div className="flexRS">
                  <div className="savedSPrice">
                    ₹{Number(stock.stockPrice).toFixed(2)}
                  </div>

                  <div className="bhaiR">
                    <div
                      className="savedSChange"
                      style={{
                        color:
                          stock.stockMoneyC >= 0 ? "rgb(21, 169, 21)" : "red",
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
              </div>
            ))}
        </div>
      ) : (
        <div className="noStock">⚠️ No Saved Stock Found</div>
      )}
    </div>
  );
};

export default Wishlist;
