import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import "./stocks.css";

const BuyBox = ({ stockData, closePopup }) => {
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

  const handleStockC = (e) => {
    const newStockCount = Number(e.target.value);

    if (newStockCount * Number(stockData.currPrice) > user.balance) {
      const perfectStockCount = Math.floor(Number(user.balance) / Number(stockData.currPrice));
      alert("⚠️ Not Enough Money");
      setStockCount(perfectStockCount);
    } else {
      setStockCount(newStockCount);
    }
  };

  useEffect(() => {
    setLiveStockCP((stockCount * stockData.currPrice).toFixed(2));
  }, [stockCount, stockData.currPrice]);

  const handleBuy = () => {
    if (stockCount === 0) {
      alert("⚠️ Please select number of stocks");
      return;
    }

    if (usePasscode && enteredPasscode !== user.passcode) {
      alert("⚠️ Incorrect Passcode");
      return;
    }

    const totalCost = stockCount * Number(stockData.currPrice);

    if (totalCost <= user.balance) {
      const newPortfolio = user.portfolio || [];

      const existingStockIndex = newPortfolio.findIndex(stock => stock.stockTicker === stockData.stockTicker);

      if (existingStockIndex >= 0) {
        const existingStock = newPortfolio[existingStockIndex];
        const previousQuantity = existingStock.quantity || 0;
        const previousBuyPrice = existingStock.buyPrice || Number(stockData.currPrice);

        const newQuantity = previousQuantity + stockCount;
        const newBuyPrice = ((previousQuantity * previousBuyPrice) + (stockCount * Number(stockData.currPrice))) / newQuantity;

        newPortfolio[existingStockIndex] = {
          ...existingStock,
          quantity: newQuantity,
          buyPrice: newBuyPrice.toFixed(2),
          stockName: existingStock.stockName || stockData.result.name
        };
      } else {
        newPortfolio.push({
          stockTicker: stockData.stockTicker,
          stockName: stockData.name || "Unknown",
          quantity: stockCount,
          buyPrice: Number(stockData.currPrice).toFixed(2)
        });
      }

      const newTransactions = user.transactions || [];
      const transaction = {
        transMess: `Buy ${stockCount} shares of ${stockData.stockTicker}`,
        transAmt: totalCost.toFixed(2),
        transStatus: "debit"
      };

      if (newTransactions.length >= 30) {
        newTransactions.shift();
      }
      newTransactions.push(transaction);

      const updatedUser = {
        ...user,
        balance: user.balance - totalCost,
        portfolio: newPortfolio,
        transactions: newTransactions
      };
      setUser(updatedUser);

      closePopup();
    } else {
      alert("⚠️ Not Enough Money");
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

        {usePasscode && (
          <input
            type="number"
            placeholder="Enter Passcode"
            value={enteredPasscode}
            onChange={(e) => setEnteredPasscode(e.target.value)}
            className="passcode-input"
          />
        )}

        <button onClick={handleBuy} className="buy-button">
          Buy
        </button>
      </div>
    </div>
  );
};

export default BuyBox;
