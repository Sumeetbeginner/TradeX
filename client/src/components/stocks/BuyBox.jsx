import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./stocks.css";

const BuyBox = ({ stockData, closePopup }) => {
  const { user, setUser } = useContext(UserContext);
  const [stockCount, setStockCount] = useState(0);
  const [liveStockCP, setLiveStockCP] = useState(Number(stockData.currPrice));

  const handleStockC = (e) => {
    const newStockCount = Number(e.target.value);

    if (newStockCount * Number(stockData.currPrice) > user.balance) {
      const perfectStockCount = Math.floor(Number(user.balance) / Number(stockData.currPrice));

      alert('⚠️ Not Enough Money');
      setStockCount(perfectStockCount);
    }
     else {
      setStockCount(newStockCount);
    }
  };

  useEffect(() => {
    setLiveStockCP((stockCount * stockData.currPrice).toFixed(2));
  }, [stockCount]);

  const handleBuy = () => {

    if(stockCount == 0){
        alert('⚠️ Please select number of stocks')
        return;
    }

    const totalCost = stockCount * Number(stockData.currPrice);

    if (totalCost <= user.balance) {
      const newPortfolio = user.portfolio || [];

      // Find existing stock index
      const existingStockIndex = newPortfolio.findIndex(stock => stock.stockTicker === stockData.stockTicker);

      if (existingStockIndex >= 0) {
        // Stock exists, calculate new average buy price
        const existingStock = newPortfolio[existingStockIndex];
        const previousQuantity = existingStock.quantity || 0;
        const previousBuyPrice = existingStock.buyPrice || Number(stockData.currPrice);
        
        const newQuantity = previousQuantity + stockCount;
        const newBuyPrice = ((previousQuantity * previousBuyPrice) + (stockCount * Number(stockData.currPrice))) / newQuantity;

        // Update existing stock
        newPortfolio[existingStockIndex] = {
          ...existingStock,
          quantity: newQuantity,
          buyPrice: newBuyPrice.toFixed(2),
          stockName: existingStock.stockName || stockData.result.name
          
        };
      } else {
        // Add new stock to portfolio
        newPortfolio.push({
          stockTicker: stockData.stockTicker,
          stockName: stockData.name || "Unknown",
          quantity: stockCount,
          buyPrice: Number(stockData.currPrice).toFixed(2)
        });
      }

      // Update transactions
      const newTransactions = user.transactions || [];
      const transaction = {
        transMess: `Buy ${stockCount} shares of ${stockData.stockTicker}`,
        transAmt: totalCost.toFixed(2),
        transStatus: 'debit'
      };

      if (newTransactions.length >= 30) {
        newTransactions.shift(); // Remove oldest transaction if there are already 30
      }
      newTransactions.push(transaction);

      // Update user state
      const updatedUser = {
        ...user,
        balance: user.balance - totalCost,
        portfolio: newPortfolio,
        transactions: newTransactions
      };
      setUser(updatedUser);

      // Close popup after updating user state
      closePopup();
    } else {
      alert('⚠️ Not Enough Money');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="topBuy">
          <h2>Buy {stockData.stockTicker}</h2>
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
          placeholder="Enter Number of Stocks to Buy"
          className="inputStock"
        
        />
        <h2 className="stockPL">₹{liveStockCP}</h2>
        <button onClick={handleBuy} className="buy-button">
          Buy
        </button>
      </div>
    </div>
  );
};

export default BuyBox;
