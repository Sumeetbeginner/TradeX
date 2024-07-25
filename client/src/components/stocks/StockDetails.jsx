import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StockLineChart from "./StockChart";
import { UserContext } from "../../UserContext";
import "./stocks.css";
import BuyBox from "./BuyBox";
import SellBox from "./SellBox";

const StockInfo = () => {
  const [stockData, setStockData] = useState(null);
  const [impStockData, setImpStockData] = useState(null);
  const [error, setError] = useState("");
  const [savedTrue, setSavedTrue] = useState(false);
  const savedIconRef = useRef(null);
  const [updateP, setUpdateP] = useState(false)

  const navigate = useNavigate();

  // Clicked Stock Ticker
  const currStockData = localStorage.getItem("currStockData");

  const { toggleSavedStock, isStockSaved, user } = useContext(UserContext);

  const updateParentState = (newValue) =>{
    setUpdateP(newValue)
  }

  // Fetch Stock info with the help of ticker from server
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

  // Set Imp Stock Data in seperate json object
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
          stockTicker : currStockData,
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
        // console.log(impStockData);
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
          // console.log("Is stock saved:", isSaved);
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
    setSellBoxV(true)
  };

  const togglePopupB = () => {
    setBuyBoxV(false);
  };
  const togglePopupS = () => {
    setSellBoxV(false);
  };

  // Fetch Stock Info Every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStockInfo();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
                    <span>200 Day Avg</span> : ₹
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
                    <span>52 Week High</span> : ₹
                    {impStockData?.fiftyTwoWeekHigh}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>52 Week Low</span> : ₹{impStockData?.fiftyTwoWeekLow}
                  </span>
                  <span className="spanBro">
                    {" "}
                    <span>Avg Volume</span> : {impStockData?.avgVolume}
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
                    <span>Previous Close</span> : ₹{impStockData?.previousClose}
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
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default StockInfo;
