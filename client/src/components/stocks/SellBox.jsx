import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./stocks.css";

const SellBox = ({ updateP, stockData, closePopup, updateParentState }) => {
  const { user, setUser } = useContext(UserContext);
  const [stockCount, setStockCount] = useState(0);
  const [liveStockCP, setLiveStockCP] = useState(Number(stockData.currPrice));
  const [usePasscode, setUsePasscode] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState("");

  useEffect(() => {
    if (user.passcode !== "unset") {
      setUsePasscode(true);
    }
  }, [user.passcode]);

  useEffect(() => {
    setLiveStockCP((Number(stockCount) * Number(stockData.currPrice)).toFixed(2));
  }, [stockCount, stockData.currPrice]);

  const handleStockC = (e) => {
    const newStockCount = Number(e.target.value);

    const existingStock = user.portfolio.find(
      (stock) => stock.stockTicker === stockData.stockTicker
    );

    if (newStockCount > existingStock.quantity) {
      alert("⚠️ Not Enough Stocks to Sell");
      setStockCount(existingStock.quantity);
    } else {
      setStockCount(newStockCount);
    }
  };

  const handleSell = async () => {
    if (stockCount === 0) {
      alert("⚠️ Please select number of stocks");
      return;
    }

    if (usePasscode && enteredPasscode !== user.passcode) {
      alert("⚠️ Incorrect Passcode");
      return;
    }

    // Fetch the latest stock price
    const response = await fetch("https://tradexservers.vercel.app/stockinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stockTicker: stockData.stockTicker }),
    });

    if (!response.ok) {
      alert("⚠️ Error fetching stock price");
      return;
    }

    const data = await response.json();
    const latestPrice = parseFloat(data.result.currentPrice);
    const totalRevenue = stockCount * latestPrice;

    const newPortfolio = user.portfolio || [];

    const existingStockIndex = newPortfolio.findIndex(
      (stock) => stock.stockTicker === stockData.stockTicker
    );

    if (existingStockIndex >= 0) {
      const existingStock = newPortfolio[existingStockIndex];
      const previousQuantity = existingStock.quantity || 0;

      const newQuantity = previousQuantity - stockCount;

      if (newQuantity > 0) {
        newPortfolio[existingStockIndex] = {
          ...existingStock,
          quantity: newQuantity,
        };
      } else {
        newPortfolio.splice(existingStockIndex, 1);
      }

      const newTransactions = user.transactions || [];
      const transaction = {
        transMess: `Sell ${stockCount} shares of ${stockData.stockTicker}`,
        transAmt: totalRevenue.toFixed(2),
        transStatus: "credit",
      };

      if (newTransactions.length >= 30) {
        newTransactions.shift();
      }
      newTransactions.push(transaction);

      const updatedUser = {
        ...user,
        balance: user.balance + totalRevenue,
        portfolio: newPortfolio,
        transactions: newTransactions,
      };
      setUser(updatedUser);

      updateParentState(!updateP);
      closePopup();
    } else {
      alert("⚠️ Stock not found in portfolio");
    }
  };

  const isPortfolioEmpty = !user.portfolio || user.portfolio.length === 0;

  return (
    <div className="popup-container">
      {isPortfolioEmpty ? (
        <div className="popup-box">
          <div className="topSell">
            <h2>No Stocks to Sell</h2>
            <i
              id="closeP"
              onClick={closePopup}
              className="fa-solid fa-xmark"
            ></i>
          </div>
        </div>
      ) : (
        <div className="popup-box">
          <div className="topSell">
            <h2>Sell {stockData.stockTicker}</h2>
            <i
              id="closeP"
              onClick={closePopup}
              className="fa-solid fa-xmark"
            ></i>
          </div>
          <input
            value={stockCount}
            onChange={handleStockC}
            type="number"
            placeholder="Enter Number of Stocks to Sell"
            className="inputStock"
          />
          <h2 className="stockPL">₹{liveStockCP}</h2>

          {usePasscode && (
            <input
              type="password"
              placeholder="Enter Passcode"
              value={enteredPasscode}
              onChange={(e) => setEnteredPasscode(e.target.value)}
              className="passcode-input"
            />
          )}

          <button onClick={handleSell} className="sell-button">
            Sell
          </button>
        </div>
      )}
    </div>
  );
};

export default SellBox;
