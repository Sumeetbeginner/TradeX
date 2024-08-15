import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import stocksData from "../../assets/data/nse.json";
import "./search.css";
import { UserContext } from "../../UserContext";
import SearchBar from "./SearchBar";
import './msearch.css'

const Search = () => {

  const { user } = useContext(UserContext);
  const [topGainers, setTopGainers] = useState([]);
  const [topGainersF, setTopGainersF] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [topLosersF, setTopLosersF] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTopGainers = async () => {
    try {
      const response = await fetch("https://tradexservers.vercel.app/topgainers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopGainers(data.top_gainers);
    } catch (error) {
      console.error("Error fetching top gainers:", error);
    }
  };

  // Function to fetch top losers from the server
  const fetchTopLosers = async () => {
    try {
      const response = await fetch("https://tradexservers.vercel.app/toplosers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopLosers(data.top_losers); 
    } catch (error) {
      console.error("Error fetching top losers:", error);
    }
  };

  // Function to fetch stock info for a given ticker
  const fetchStockInfo = async (stockTicker) => {
    try {
      const response = await fetch("https://tradexservers.vercel.app/stockinfo", {
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

  const openStockBro = (stockTicker) =>{
    localStorage.setItem('currStockData', stockTicker)
    navigate('/stockinfo')
  }

  return (
    <div className="bhaiK">

      <SearchBar />

      <div className="bothB">
        <p className="headN">Nifty 200 Top Gainers</p>
        <div className="gainersE">
          {topGainersF.length > 0 ? (
            topGainersF.map((gainer, index) => (
              <div onClick={() => {openStockBro(gainer.stockTicker)}} key={index} className="gainerChild">
                <p className="stockTickerH">{gainer.stockTicker}</p>
                <p className="stockPriceH">₹{gainer.stockPrice}</p>
                <p className="stockMoneyCHG">+₹{gainer.stockMoneyC}</p>
                <p className="stockPerHG">{gainer.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader1">Loading Stocks...</div>
          )}
        </div>

        <p className="headN">Nifty 200 Top Losers</p>
        <div className="losersE">
          {topLosersF.length > 0 ? (
            topLosersF.map((loser, index) => (
              <div  onClick={() => {openStockBro(loser.stockTicker)}}  key={index} className="loserChild">
                <p className="stockTickerH">{loser.stockTicker}</p>
                <p className="stockPriceH">₹{loser.stockPrice}</p>
                <p className="stockMoneyCHL">₹{loser.stockMoneyC}</p>
                <p className="stockPerHL">{loser.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader1">Loading Stocks...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
