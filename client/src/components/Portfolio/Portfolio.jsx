import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./portfolio.css";

const Portfolio = () => {
  const { user } = useContext(UserContext);
  const [portfolio, setPortfolio] = useState(user.portfolio || []);
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to true initially

  useEffect(() => {
    // Fetch Stock Info of Ticker
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

    // Fetch All Stock Info in Portfolio
    const updatePortfolioData = async () => {
      // setLoading(true); // Set loading to true when fetching data

      const updatedData = await Promise.all(
        portfolio.map(async (stock) => {
          const sdata = await fetchStockInfo(stock.stockTicker);
          if (sdata) {
            const currentPrice = Number(sdata.result.currentPrice);
            const quantity = Number(stock.quantity);
            const buyPrice = Number(stock.buyPrice);

            const buyValue = buyPrice * quantity;
            const currentValue = currentPrice * quantity;
            const rupeeChange = currentValue - buyValue;
            const percentChange = ((rupeeChange / buyValue) * 100).toFixed(2);

            return {
              ...stock,
              currentPrice: currentPrice.toFixed(2),
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
      // setLoading(false); // Set loading to false after data is fetched
    };

    // Run updatePortfolioData every 5 seconds
    const intervalId = setInterval(() => {
      if (portfolio.length > 0) {
        updatePortfolioData();
      }
    }, 10000);

    // Run updatePortfolioData on initial load
    if (portfolio.length > 0) {
      updatePortfolioData();
    }

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [portfolio]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="portfolio-container">
      {portfolioData.length > 0 ? (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Buy Value (₹)</th>
              <th>Current Value (₹)</th>
              <th>Rupee Change (₹)</th>
              <th>Percent Change (%)</th>
              <th>Sell</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.stockTicker}</td>
                <td>{stock.quantity}</td>
                <td>₹{stock.buyValue}</td>
                <td>₹{stock.currentValue}</td>
                <td
                  style={{
                    color: stock.rupeeChange >= 0 ? "rgb(21, 169, 21)" : "red",
                  }}
                >
                  ₹{stock.rupeeChange}
                </td>
                <td
                  style={{
                    color: stock.percentChange >= 0 ? "rgb(21, 169, 21)" : "red",
                  }}
                >
                  {stock.percentChange}%
                </td>
                <td>
                  <button
                    onClick={() => {
                      // Handle sell stock logic here
                    }}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="loader loaderkabhai"></div>
      )}
    </div>
  );
};

export default Portfolio;
