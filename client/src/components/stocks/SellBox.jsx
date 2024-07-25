import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./stocks.css";

const SellBox = ({ updateP, stockData, closePopup, updateParentState }) => {
  const { user, setUser } = useContext(UserContext);
  const [stockCount, setStockCount] = useState(0);
  const [liveStockCP, setLiveStockCP] = useState(Number(stockData.currPrice));

  console.log();

  useEffect(() => {
  
    console.log(stockData);
    setLiveStockCP((Number(stockCount) * Number(stockData.currPrice)).toFixed(2));
    console.log(liveStockCP);

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

  const handleSell = () => {
    if (stockCount === 0) {
      alert("⚠️ Please select number of stocks");
      return;
    }

    const totalRevenue = stockCount * Number(stockData.currPrice);
    const newPortfolio = user.portfolio || [];

    // Find existing stock index
    const existingStockIndex = newPortfolio.findIndex(
      (stock) => stock.stockTicker === stockData.stockTicker
    );

    if (existingStockIndex >= 0) {
      // Stock exists, update the quantity
      const existingStock = newPortfolio[existingStockIndex];
      const previousQuantity = existingStock.quantity || 0;

      const newQuantity = previousQuantity - stockCount;

      if (newQuantity > 0) {
        // Update existing stock
        newPortfolio[existingStockIndex] = {
          ...existingStock,
          quantity: newQuantity,
        };
      } else {
        // Remove stock from portfolio if quantity is zero
        newPortfolio.splice(existingStockIndex, 1);
      }

      // Update transactions
      const newTransactions = user.transactions || [];
      const transaction = {
        transMess: `Sell ${stockCount} shares of ${stockData.stockTicker}`,
        transAmt: totalRevenue.toFixed(2),
        transStatus: "credit",
      };

      if (newTransactions.length >= 30) {
        newTransactions.shift(); // Remove oldest transaction if there are already 30
      }
      newTransactions.push(transaction);

      // Update user state
      const updatedUser = {
        ...user,
        balance: user.balance + totalRevenue,
        portfolio: newPortfolio,
        transactions: newTransactions,
      };
      setUser(updatedUser);
      console.log(user);

      updateParentState(!updateP);
      // Close popup after updating user state
      closePopup();
    } else {
      alert("⚠️ Stock not found in portfolio");
    }
  };

  // Check if the portfolio is empty
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
          <button onClick={handleSell} className="sell-button">
            Sell
          </button>
        </div>
      )}
    </div>
  );
};

export default SellBox;
