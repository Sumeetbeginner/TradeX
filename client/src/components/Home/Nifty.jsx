import React, { useState, useEffect } from "react";
import NiftyChart from "./NiftyChart";
import "./home.css";

const Nifty = () => {
  const [niftyData, setNiftyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the current time is within market hours (Monday to Friday, 9:15 AM to 3:30 PM)
  const isMarketOpen = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hours = now.getHours();
    const minutes = now.getMinutes();

    return (
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      ((hours > 9 || (hours === 9 && minutes >= 15)) &&
       (hours < 15 || (hours === 15 && minutes <= 30)))
    );
  };

  // Function to fetch Nifty data
  const fetchNiftyData = async () => {
    try {
      const response = await fetch("https://tradexservers.vercel.app/niftydata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorT = await response.text();
        throw new Error(`Network response was not ok: ${errorT}`);
      }

      const data = await response.json();
      console.log("Fetched Nifty data:", data.nifty50data); // Log fetched data
      setNiftyData(data.nifty50data);
    } catch (error) {
      console.error("Error fetching Nifty data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchNiftyData();

    let intervalId;

    // Polling function
    const startPolling = () => {
      if (isMarketOpen()) {
        intervalId = setInterval(() => {
          if (isMarketOpen()) {
            fetchNiftyData();
          }
        }, 30000); // Fetch data every 30 seconds
      } else {
        clearInterval(intervalId); // Clear interval if market is closed
      }
    };

    startPolling();

    // Set up polling to start on component mount
    const now = new Date();
    const msUntilNextOpen = new Date(now.setHours(9, 15, 0, 0)).getTime() - Date.now();
    const msUntilClose = new Date(now.setHours(15, 30, 0, 0)).getTime() - Date.now();

    if (msUntilNextOpen > 0 && msUntilNextOpen < msUntilClose) {
      setTimeout(startPolling, msUntilNextOpen);
    }

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const percentageChangeStyle = {
    color: niftyData.priceChangePercent < 0 ? "red" : "rgb(1, 172, 1)",
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  return (
    <div className="niftyParent">
      <h1 className="headNifty">Nifty 50</h1>

      {niftyData ? (
        <div>
          <div className="flexPrice"> 
            <h1 className="currPriceN">₹{formatNumber(niftyData.currPrice)}</h1>
            <h3 className="currPerN" style={percentageChangeStyle}>
              ₹{niftyData.priceChange} ({niftyData.priceChangePercent}%)
            </h3>
          </div>
          <div className="niftyChart">
            <NiftyChart niftydata={niftyData} />
          </div>
          <div className="flexNifty">
            <div className="flexNL">
              <span className="spanBhai">
                <span>Prev Close</span> : ₹{formatNumber(niftyData.previousClose)}
              </span>
              <span className="spanBhai">
                <span>YTD Change</span> : {niftyData.ytdChange}%
              </span>
            </div>
            <hr />
            <div className="flexNR">
              <span className="spanBhai">
                <span>52W High</span> : ₹{formatNumber(niftyData.yearHigh)}
              </span>
              <span className="spanBhai">
                <span>52W Low</span> : ₹{formatNumber(niftyData.yearLow)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default Nifty;
