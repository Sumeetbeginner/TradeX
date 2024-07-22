import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockLineChart from "./StockChart";
import "./stocks.css";

const StockInfo = () => {
  const [stockData, setStockData] = useState(null);
  const [impStockData, setImpStockData] = useState(null);
  const [error, setError] = useState("");

  const currStockData = localStorage.getItem("currStockData");

  const navigate = useNavigate();

  const fetchStockInfo = async () => {
    if (!currStockData) {
      navigate("/");
      setError("No stock selected");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/stockinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockTicker: currStockData }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setStockData(data);
      console.log(data);
      setError("");
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Failed to fetch stock data. Please try again.");
      setStockData(null);
    }
  };

  useEffect(() => {
    fetchStockInfo();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchStockInfo, 500000);
    // Change it the five seconds later

    return () => clearInterval(intervalId);
  }, [currStockData]);

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  

  useEffect(() => {
    if (stockData) {
      const setImpStock = () => {
        if (!stockData) return;

        let stockMoneyC =
          Number(stockData.result.currentPrice) - Number(stockData.result.open);
        let stockPChange = (
          (stockMoneyC / Number(stockData.result.open)) *
          100
        ).toFixed(2);

        setImpStockData({
          name: stockData.result.shortName, //Done
          symbol: stockData.result.symbol, //Done
          open: stockData.result.open, //Done
          dayHigh: stockData.result.dayHigh, //Done
          dayLow: stockData.result.dayLow, //Done
          currPrice: stockData.result.currentPrice, //Done
          percentageChange: stockPChange, //Done
          stockPriceChange: stockMoneyC.toFixed(2), //Done
          currVolume: stockData.result.volume,
          avgVolume: stockData.result.averageVolume,
          address: stockData.result.address2,
          fiftyDayAverage: Number(stockData.result.fiftyDayAverage).toFixed(2),
          fiftyTwoWeekHigh: stockData.result.fiftyTwoWeekHigh,
          industry: stockData.result.industry,
          longBusinessSummary: stockData.result.longBusinessSummary,
          marketCap: formatNumber(stockData.result.marketCap),
          previousClose: stockData.result.previousClose,
          sector: stockData.result.sector,
          totalDebt: stockData.result.totalDebt,
          totalRevenue: stockData.result.totalRevenue,
          twoHundredDayAverage: Number(stockData.result.twoHundredDayAverage).toFixed(2),
          website: stockData.result.website,
        });
      };

      setImpStock();
    }
  }, [stockData]);

  return (
    <div className="stockDBody">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stockData ? (
        <div className="stockDashboard">
          <div className="stockTopBar">
            <div className="leftI">
              <i
                onClick={() => navigate("/search")}
                className="fa-solid fa-arrow-left"
              ></i>
            </div>
            <div className="rightI">
              <i className="fa-solid fa-bookmark"></i>
              <i className="fa-solid fa-chart-simple"></i>
              <i className="fa-solid fa-newspaper"></i>
              <i className="fa-solid fa-download"></i>
              <i
                onClick={() => fetchStockInfo()}
                className="fa-solid fa-rotate-right"
              ></i>
            </div>
          </div>

          <div className="flexStock">
            <div className="leftStock">
              <div className="topDetailsBro">
                <div className="stockNameTop">
                  <h1 className="stockName">{impStockData?.name}</h1>

                  <h3 className="stockSymbol">{impStockData?.symbol}</h3>
                </div>

                <div className="stockPBro">
                  <h2 className="stockPrice">
                    ₹{Number(impStockData?.currPrice).toFixed(2)}
                  </h2>

                  <div className="flexCBro">
                    <p
                      className="stockPriceC"
                      style={{
                        color:
                          Number(impStockData?.stockPriceChange) >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      ₹{impStockData?.stockPriceChange}
                      <i
                        className={`fa-solid ${
                          Number(impStockData?.stockPriceChange) >= 0
                            ? "fa-arrow-trend-up"
                            : "fa-arrow-trend-down"
                        }`}
                      ></i>
                    </p>
                    <p
                      className="stockChange"
                      style={{
                        color:
                          Number(impStockData?.percentageChange) >= 0
                            ? "green"
                            : "red",
                      }}
                    >
                      ({Number(impStockData?.percentageChange).toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="stockChart">
                {impStockData && <StockLineChart stockData={impStockData} />}
              </div>

              <div className="impDataDown">
                <div className="impDC">
                  <span className="spanBro sp2">
                    {" "}
                    <span>Volume</span> : {impStockData?.currVolume}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>Market Capital</span> : ₹{impStockData?.marketCap}
                  </span>
                </div>
                <hr className="lineB"></hr>
                <div className="impDC">
                  <span className="spanBro sp2">
                    {" "}
                    <span>50 Day Avg</span> : ₹{impStockData?.fiftyDayAverage}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>200 Day Avg</span> : ₹{impStockData?.twoHundredDayAverage}
                  </span>
                </div>
              </div>
              <div className="btnActionBS">
                <button className="buyBtn">Buy</button>
                <button className="sellBtn">Sell</button>
              </div>
            </div>

            <div className="rightStock"></div>
          </div>
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default StockInfo;
