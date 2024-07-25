import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./portfolio.css";
import { useNavigate } from "react-router-dom";
import SellBox from "../stocks/SellBox";

const Portfolio = () => {
  const { user } = useContext(UserContext);
  const [portfolio, setPortfolio] = useState(user.portfolio || []);
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impStockData, setImpStockData] = useState(null);
  const [updateP, setUpdateP] = useState(true);
  const [sellBoxV, setSellBoxV] = useState(false);

  const navigate = useNavigate();

  const currStockData = localStorage.getItem("currStockData");

  // Format Currency for better presentation
  function formatCurrency(amount) {
    if (typeof amount !== "number") {
      amount = parseFloat(amount);
    }
    if (isNaN(amount)) return "Invalid number";

    const [integerPart, decimalPart] = amount.toFixed(2).split(".");

    let lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);

    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }

    const result =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return `₹${result}.${decimalPart}`;
  }

  // Format number for better presentation
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // useEffect(() => {
  //   if(portfolio == []){
  //     console.log('Bro [');
  //   }
  // }, [portfolio])

  useEffect(() => {

    const fetchStockInfo = async (stockTicker) => {
      try {
        const response = await fetch("http://localhost:3000/stockinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockTicker: stockTicker }),
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

    const updatePortfolioData = async () => {
      const updatedData = await Promise.all(
        portfolio.map(async (stock) => {
          const sdata = await fetchStockInfo(stock.stockTicker);

          if (sdata) {
            const currPrice = Number(sdata.result.currentPrice);
            const quantity = Number(stock.quantity);
            const buyPrice = Number(stock.buyPrice);

            const buyValue = buyPrice * quantity;
            const currentValue = currPrice * quantity;
            const rupeeChange = currentValue - buyValue;
            const percentChange = ((rupeeChange / buyValue) * 100).toFixed(2);

            const stockPChange = (currPrice - buyPrice).toFixed(2);
            const stockMoneyC = rupeeChange;

            setImpStockData({
              name: sdata.result.shortName,
              stockTicker: stock.stockTicker,
              symbol: sdata.result.symbol,
              open: sdata.result.open,
              dayHigh: sdata.result.dayHigh,
              dayLow: sdata.result.dayLow,
              currPrice: sdata.result.currentPrice,
              percentageChange: stockPChange,
              stockPriceChange: stockMoneyC.toFixed(2),
              currVolume: formatNumber(Number(sdata.result.volume)),
              avgVolume: formatNumber(Number(sdata.result.averageVolume)),
              address: sdata.result.address2,
              fiftyDayAverage: Number(sdata.result.fiftyDayAverage).toFixed(2),
              fiftyTwoWeekHigh: sdata.result.fiftyTwoWeekHigh,
              fiftyTwoWeekLow: sdata.result.fiftyTwoWeekLow,
              industry: sdata.result.industry,
              longBusinessSummary: sdata.result.longBusinessSummary,
              marketCap: formatNumber(sdata.result.marketCap),
              previousClose: sdata.result.previousClose,
              totalDebt: formatNumber(Number(sdata.result.totalDebt)),
              totalRevenue: formatNumber(Number(sdata.result.totalRevenue)),
              twoHundredDayAverage: Number(
                sdata.result.twoHundredDayAverage
              ).toFixed(2),
              website: sdata.result.website,
              longName: sdata.result.longName,
              city: sdata.result.city,
            });

            return {
              ...stock,
              currPrice: currPrice.toFixed(2),
              buyValue: buyValue.toFixed(2),
              currentValue: currentValue.toFixed(2),
              rupeeChange: rupeeChange.toFixed(2),
              percentChange,
            };
          }
          return null;
        })
      );

      setPortfolioData(updatedData.filter((stock) => stock !== null));
      setLoading(false);
    };

    if (portfolio.length > 0) {
      updatePortfolioData();
      const intervalId = setInterval(() => {
        updatePortfolioData();
      }, 10000);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    } else {
      setLoading(false);
    }
  }, [portfolio, updateP]);

  const openStockInfo = (stockTicker) => {
    localStorage.setItem("currStockData", stockTicker);
    navigate("/stockinfo");
  };

  const sellCurrentStock = (stock) => {
    setImpStockData(stock);
    setSellBoxV(true);
  };

  const togglePopupS = () => {
    setSellBoxV(false);
  };

  const updateParentState = (newValue) => {
    setUpdateP(newValue);
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="portfolio-container">
      {portfolioData.length > 0 ? (
        <table className="portfolio-table">
          <thead className="portH">
            <tr>
              <th>Index</th>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Buy Value (₹)</th>
              <th>Curr Price (₹)</th>
              <th>₹ Change</th>
              <th>% Change</th>
              <th>Sell Stock</th>
            </tr>
          </thead>
          <tbody className="portB">
            {portfolioData
              .slice()
              .reverse()
              .map((stock, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td
                    onClick={() => {
                      openStockInfo(stock.stockTicker);
                    }}
                    className="stockTiku"
                  >
                    {stock.stockTicker}
                  </td>
                  <td>{stock.quantity}</td>
                  <td>{formatCurrency(stock.buyValue)}</td>
                  <td
                    style={{
                      color:
                        stock.rupeeChange >= 0 ? "rgb(21, 169, 21)" : "red",
                    }}
                    className="boldBhai"
                  >
                    {formatCurrency(stock.currentValue)}
                  </td>
                  <td
                    className="boldBhai"
                    style={{
                      color:
                        stock.rupeeChange >= 0 ? "rgb(21, 169, 21)" : "red",
                    }}
                  >
                    ₹{stock.rupeeChange}
                  </td>
                  <td
                    className="boldBhai"
                    style={{
                      color:
                        stock.percentChange >= 0 ? "rgb(21, 169, 21)" : "red",
                    }}
                  >
                    ({stock.percentChange}%)
                  </td>
                  <td>
                    <button
                      id="portSBtn"
                      onClick={() => {
                        sellCurrentStock(stock);
                      }}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>

          {sellBoxV && impStockData && (
            <SellBox
              updateP={updateP}
              stockData={impStockData}
              closePopup={togglePopupS}
              updateParentState={updateParentState}
            />
          )}
        </table>
      ) : (
        <div className="">No Stock Found in Portfolio</div>
      )}
    </div>
  );
};

export default Portfolio;
