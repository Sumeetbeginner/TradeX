import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StockLineChart from "./StockChart";
import { UserContext } from "../../UserContext";
import "./stocks.css";
import BuyBox from "./BuyBox";
import SellBox from "./SellBox";
import { jsPDF } from 'jspdf';
import StockDataA from "./StockDataA";
import './mstocks.css'

const StockInfo = () => {
  const [stockData, setStockData] = useState(null);
  const [impStockData, setImpStockData] = useState(null);
  const [error, setError] = useState("");
  const [savedTrue, setSavedTrue] = useState(false);
  const savedIconRef = useRef(null);
  const [updateP, setUpdateP] = useState(false);

  const [showStockA, setShowStockA] = useState(false);

  const navigate = useNavigate();

  // Clicked Stock Ticker
  const currStockData = localStorage.getItem("currStockData");

  const { toggleSavedStock, isStockSaved, user } = useContext(UserContext);

  const updateParentState = (newValue) => {
    setUpdateP(newValue);
  };

  // Function to check if current time is within market hours
  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Market is open Monday to Friday, from 9:15 AM to 3:30 PM
    return day >= 1 && day <= 5 && (hour > 9 || (hour === 9 && minute >= 15)) && (hour < 15 || (hour === 15 && minute <= 30));
  };

  // Fetch Stock info with the help of ticker from server
  const fetchStockInfo = async () => {
    if (!currStockData) {
      navigate("/");
      setError("No stock selected");
      return;
    }

    try {
      const response = await fetch("https://tradexservers.vercel.app/stockinfo", {
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

  // Format Number : Ex - 1000 = 1K
  const formatNumber = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + "T";
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  // If Stock Ticker Changes then it fetches stock data again
  useEffect(() => {
    fetchStockInfo();
  }, [currStockData]);

  // Set Imp Stock Data in separate json object
  useEffect(() => {
    if (stockData) {
      const setImpStock = () => {
        if (!stockData) return;

        // Calculate the absolute change in stock price
        let stockMoneyC =
          Number(stockData.result.currentPrice) -
          Number(stockData.result.previousClose);

        // Calculate the percentage change based on the opening price
        let stockPChange = (
          (stockMoneyC / Number(stockData.result.open)) *
          100
        ).toFixed(2);

        setImpStockData({
          name: stockData.result.shortName,
          stockTicker: currStockData,
          symbol: stockData.result.symbol,
          open: stockData.result.open,
          dayHigh: stockData.result.dayHigh,
          dayLow: stockData.result.dayLow,
          currPrice: stockData.result.currentPrice,
          percentageChange: stockPChange,
          stockPriceChange: stockMoneyC.toFixed(2),
          currVolume: formatNumber(Number(stockData.result.volume)),
          avgVolume: formatNumber(Number(stockData.result.averageVolume)),
          address: stockData.result.address2,
          fiftyDayAverage: Number(stockData.result.fiftyDayAverage).toFixed(2),
          fiftyTwoWeekHigh: stockData.result.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: stockData.result.fiftyTwoWeekLow,
          industry: stockData.result.industry,
          longBusinessSummary: stockData.result.longBusinessSummary,
          marketCap: formatNumber(stockData.result.marketCap),
          previousClose: stockData.result.previousClose,
          totalDebt: formatNumber(Number(stockData.result.totalDebt)),
          totalRevenue: formatNumber(Number(stockData.result.totalRevenue)),
          twoHundredDayAverage: Number(
            stockData.result.twoHundredDayAverage
          ).toFixed(2),
          website: stockData.result.website,
          longName: stockData.result.longName,
          city: stockData.result.city,
        });
      };

      setImpStock();
    }
  }, [stockData]);

  // Checks if the currStock is saved by user or not
  useEffect(() => {
    if (currStockData) {
      const checkSavedStatus = async () => {
        try {
          const isSaved = await isStockSaved(currStockData);
          setSavedTrue(isSaved);
        } catch (error) {
          console.error("Error checking stock saved status:", error);
        }
      };
      checkSavedStatus();
    }
  }, [currStockData, isStockSaved]);

  // Update color of saved icon based on saved or not
  useEffect(() => {
    if (savedIconRef.current) {
      savedIconRef.current.style.color = savedTrue ? "var(--logo)" : "white";
    }
  }, [savedTrue]);

  // OnClick Save Icon Update Saved Ticker or Not in User Data and Toggle Saved Icon
  const handleSaveClick = () => {
    if (currStockData) {
      toggleSavedStock(currStockData);
      setSavedTrue((prevSavedTrue) => !prevSavedTrue);
    }
  };

  const [buyBoxV, setBuyBoxV] = useState(false);
  const [sellBoxV, setSellBoxV] = useState(false);

  const buyCurrentStock = () => {
    if (Number(user.balance) < impStockData.currPrice) {
      alert("⚠️ Not enough money to buy this stock");
    } else {
      setBuyBoxV(true);
    }
  };
  const sellCurrentStock = () => {
    setSellBoxV(true);
  };

  const togglePopupB = () => {
    setBuyBoxV(false);
  };
  const togglePopupS = () => {
    setSellBoxV(false);
    setShowStockA(false);
  };

  // Fetch Stock Info Every 10 seconds if market is open
  useEffect(() => {
    let intervalId;

    const startInterval = () => {
      if (isMarketOpen()) {
        intervalId = setInterval(() => {
          fetchStockInfo();
        }, 10000);
      } else {
        clearInterval(intervalId);
      }
    };

    // Check market status immediately and start interval if market is open
    startInterval();

    // Check market status every minute and adjust interval
    const marketCheckIntervalId = setInterval(() => {
      startInterval();
    }, 60000);

    return () => {
      clearInterval(intervalId);
      clearInterval(marketCheckIntervalId);
    };
  }, [currStockData]);

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${stockData.result.shortName} Data`, 20, 20);

    let yPosition = 30;
    for (const [key, value] of Object.entries(stockData.result)) {
        if (key !== 'companyOfficers') { 
            doc.setFontSize(12);
            doc.text(`${key}: ${value}`, 20, yPosition);
            yPosition += 10;
        }
    }

    doc.save(`${stockData.result.shortName}.pdf`);
  };

  return (
    <div className="stockDBody">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stockData ? (
        <div className="stockDashboard">
          <div className="stockTopBar">
            <div className="leftI">
              <i
                onClick={() => navigate(-1)}
                className="fa-solid fa-arrow-left"
              ></i>
            </div>
            <div className="rightI">
              <i
                ref={savedIconRef}
                id="savedIcon"
                onClick={() => handleSaveClick()}
                className={`fa-solid fa-bookmark ${
                  savedTrue ? "active" : "not-active"
                }`}
              ></i>
              <i onClick={() => {setShowStockA(true)}} className="fa-solid fa-chart-simple"></i>
              {/* <i className="fa-solid fa-newspaper"></i> */}
              <i onClick={() => {handleDownload()}} className="fa-solid fa-download"></i>
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
                    <span>Market Cap</span> : ₹{impStockData?.marketCap}
                  </span>
                </div>
                <hr className="lineB"></hr>
                <div className="impDC">
                  <span className="spanBro sp2">
                    {" "}
                    <span>50D Avg</span> : ₹{impStockData?.fiftyDayAverage}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>200D Avg</span> : ₹
                    {impStockData?.twoHundredDayAverage}
                  </span>
                </div>
              </div>
              <div className="btnActionBS">
                <button className="buyBtn" onClick={() => buyCurrentStock()}>
                  Buy
                </button>
                <button className="sellBtn" onClick={() => sellCurrentStock()}>Sell</button>
              </div>
            </div>

            <div className="rightStock">
              <div className="industryT">
                <span>Industry : </span> {impStockData?.industry}
              </div>

              <div className="impDataDown impD2">
                <div className="impDC">
                  <span className="spanBro sp2">
                    {" "}
                    <span>52W High</span> : ₹
                    {impStockData?.fiftyTwoWeekHigh}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>52W Low</span> : ₹{impStockData?.fiftyTwoWeekLow}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>Avg Vol</span> : {impStockData?.avgVolume}
                  </span>
                </div>
                <hr className="lineB"></hr>
                <div className="impDC">
                  <span className="spanBro sp2">
                    {" "}
                    <span>Total Debt</span> : ₹{impStockData?.totalDebt}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>Total Revenue</span> : ₹{impStockData?.totalRevenue}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>Prev Close</span> : ₹{impStockData?.previousClose}
                  </span>
                </div>
              </div>

              <div className="companyInfo">
                <h1>{impStockData?.longName}</h1>

                <details>
                  <summary>Company Information</summary>
                  <p>{impStockData?.longBusinessSummary}</p>
                </details>

                <div className="companyAdd">
                  <span>Address : </span> {impStockData?.address},{" "}
                  {impStockData?.city}
                </div>
                <div className="companyWeb">
                  <span>Website : </span>{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={impStockData?.website}
                  >
                    {impStockData?.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {buyBoxV && (
            <BuyBox stockData={impStockData} closePopup={togglePopupB} />
          )}
          {sellBoxV && (
            <SellBox updateP={updateP} stockData={impStockData} closePopup={togglePopupS} updateParentState={updateParentState}/>
          )}
          {showStockA && (
            <StockDataA closePopup={togglePopupS}/>
          )}
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default StockInfo;
