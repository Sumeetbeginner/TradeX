import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.jsx";
import "./home.css";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [topGainers, setTopGainers] = useState([]);
  const [topGainersF, setTopGainersF] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [topLosersF, setTopLosersF] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch top gainers from the server
  const fetchTopGainers = async () => {
    try {
      const response = await fetch("http://localhost:3000/topgainers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopGainers(data.top_gainers); // Access the 'top_gainers' array
    } catch (error) {
      console.error("Error fetching top gainers:", error);
    }
  };

  // Function to fetch top losers from the server
  const fetchTopLosers = async () => {
    try {
      const response = await fetch("http://localhost:3000/toplosers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopLosers(data.top_losers); // Access the 'top_losers' array
    } catch (error) {
      console.error("Error fetching top losers:", error);
    }
  };

  // Function to fetch stock info for a given ticker
  const fetchStockInfo = async (stockTicker) => {
    try {
      const response = await fetch("http://localhost:3000/stockinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockTicker }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    }
  };

  // Function to fetch and update all top gainers and losers
  const fetchAllData = async () => {
    try {
      const [gainersData, losersData] = await Promise.all([
        Promise.all(
          topGainers.map(async (stockTicker) => {
            const sdata = await fetchStockInfo(stockTicker);
            if (sdata && sdata.result) {
              let stockMoneyC =
                Number(sdata.result.currentPrice) -
                Number(sdata.result.previousClose);

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
        ),
        Promise.all(
          topLosers.map(async (stockTicker) => {
            const sdata = await fetchStockInfo(stockTicker);
            if (sdata && sdata.result) {
              let stockMoneyC =
                Number(sdata.result.currentPrice) -
                Number(sdata.result.previousClose);

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
        ),
      ]);

      setTopGainersF(gainersData.filter((stock) => stock !== null));
      setTopLosersF(losersData.filter((stock) => stock !== null));
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Initial fetch of top gainers and losers
  useEffect(() => {
    fetchTopGainers();
    fetchTopLosers();
  }, []);

  useEffect(() => {
    console.log(topGainersF);
    console.log(topLosersF);
  }, [topGainersF, topLosersF]);

  // Uncomment Afterwards
  // useEffect(() => {
  //   if (topGainers.length > 0 || topLosers.length > 0) {
  //     const intervalId = setInterval(() => {
  //       fetchAllData();
  //     }, 10000);

  //     return () => clearInterval(intervalId); // Clean up on unmount
  //   }
  // }, [topGainers, topLosers]);

  useEffect(() => {
    fetchAllData(); // Initial fetch
  }, [topGainers, topLosers]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <>
      <div className="bothB">
        <div className="gainersE">
          <h2>Top Gainers</h2>
          {topGainersF.length > 0 ? (
            topGainersF.map((gainer, index) => (
              <div key={index}>
                <p>{gainer.stockName}</p>
                <p>{gainer.stockTicker}</p>
                <p>Price: {gainer.stockPrice}</p>
                <p>Change: {gainer.stockMoneyC}</p>
                <p>Percentage Change: {gainer.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader"></div>
          )}
        </div>

        <div className="losersE">
          <h2>Top Losers</h2>
          {topLosersF.length > 0 ? (
            topLosersF.map((loser, index) => (
              <div key={index}>
                <p>{loser.stockName}</p>
                <p>{loser.stockTicker}</p>
                <p>Price: {loser.stockPrice}</p>
                <p>Change: {loser.stockMoneyC}</p>
                <p>Percentage Change: {loser.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
