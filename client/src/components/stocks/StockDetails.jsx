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

  useEffect(() => {
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
        setError("");
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to fetch stock data. Please try again.");
        setStockData(null);
      }
    };

    fetchStockInfo();
  }, [currStockData]);

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
          name: stockData.result.shortName,
          symbol: stockData.result.symbol,
          open: stockData.result.open,
          dayHigh: stockData.result.dayHigh,
          dayLow: stockData.result.dayLow,
          currPrice: stockData.result.currentPrice,
          percentageChange: stockPChange,
          stockPriceChange: stockMoneyC.toFixed(2),
          currVolume: stockData.result.volume,
          avgVolume: stockData.result.averageVolume,
          address: stockData.result.address2,
          fiftyDayAverage: stockData.result.fiftyDayAverage,
          fiftyTwoWeekHigh: stockData.result.fiftyTwoWeekHigh,
          industry: stockData.result.industry,
          longBusinessSummary: stockData.result.longBusinessSummary,
          marketCap: stockData.result.marketCap,
          previousClose: stockData.result.previousClose,
          sector: stockData.result.sector,
          totalDebt: stockData.result.totalDebt,
          totalRevenue: stockData.result.totalRevenue,
          twoHundredDayAverage: stockData.result.twoHundredDayAverage,
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
              <i className="fa-solid fa-rotate-right"></i>
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
