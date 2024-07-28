import React, { useState, useEffect } from "react";
import NiftyChart from "./NiftyChart";
import "./home.css"; 

const Nifty = () => {
  const [niftyData, setNiftyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNiftyData = async () => {
      try {
        const response = await fetch("http://localhost:3000/niftydata", {
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

    fetchNiftyData();
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
                <span>Previous Close</span> : ₹{formatNumber(niftyData.previousClose)}
              </span>
              <span className="spanBhai">
                <span>YTD Change</span> : {niftyData.ytdChange}%
              </span>
            </div>
            <hr />
            <div className="flexNR">
              <span className="spanBhai">
                <span>52 Weeks High</span> : ₹{formatNumber(niftyData.yearHigh)}
              </span>
              <span className="spanBhai">
                <span>52 Weeks Low</span> : ₹{formatNumber(niftyData.yearLow)}
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
