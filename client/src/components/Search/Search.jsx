import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import stocksData from "../../assets/data/nse.json";
import "./search.css";
import { UserContext } from "../../UserContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [topGainers, setTopGainers] = useState([]);
  const [topGainersF, setTopGainersF] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [topLosersF, setTopLosersF] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("Loaded stocks data:", stocksData);
  }, []);

  // On Entering Value in Input it will filter target value in json data and store it
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const filteredSuggestions = stocksData
        .filter(
          (stock) =>
            stock["NAME OF COMPANY"] &&
            stock["NAME OF COMPANY"].toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 7);
      // console.log("Filtered suggestions:", filteredSuggestions);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // On Click Store the selected stock in local storage and redirect to stockinfo to show details about that particular stock
  const handleSuggestionClick = (stock) => {
    // console.log("Selected stock:", stock);
    localStorage.setItem("currStockData", stock.SYMBOL);
    navigate("/stockinfo");
  };

  // Function to fetch top gainers from the server
  const fetchTopGainers = async () => {
    try {
      const response = await fetch("http://localhost:3000/topgainers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopGainers(data.top_gainers); // Access the 'top_gainers' array
    } catch (error) {
      console.error("Error fetching top gainers:", error);
    }
  };

  // Function to fetch top losers from the server
  const fetchTopLosers = async () => {
    try {
      const response = await fetch("http://localhost:3000/toplosers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network Response was not OK: ${errorText}`);
      }

      const data = await response.json();
      setTopLosers(data.top_losers); // Access the 'top_losers' array
    } catch (error) {
      console.error("Error fetching top losers:", error);
    }
  };

  // Function to fetch stock info for a given ticker
  const fetchStockInfo = async (stockTicker) => {
    try {
      const response = await fetch("http://localhost:3000/stockinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockTicker }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return null;
    }
  };

  // Function to fetch and update all top gainers and losers
  const fetchAllData = async () => {
    try {
      const [gainersData, losersData] = await Promise.all([
        Promise.all(
          topGainers.map(async (stockTicker) => {
            const sdata = await fetchStockInfo(stockTicker);
            if (sdata && sdata.result) {
              let stockMoneyC =
                Number(sdata.result.currentPrice) -
                Number(sdata.result.previousClose);

              let stockPChange = (
                (stockMoneyC / Number(sdata.result.open)) *
                100
              ).toFixed(2);

              return {
                stockTicker,
                stockName: sdata.result.shortName,
                stockPrice: sdata.result.currentPrice,
                stockMoneyC: stockMoneyC.toFixed(2),
                stockPChange: Number(stockPChange).toFixed(2),
              };
            }
            return null;
          })
        ),
        Promise.all(
          topLosers.map(async (stockTicker) => {
            const sdata = await fetchStockInfo(stockTicker);
            if (sdata && sdata.result) {
              let stockMoneyC =
                Number(sdata.result.currentPrice) -
                Number(sdata.result.previousClose);

              let stockPChange = (
                (stockMoneyC / Number(sdata.result.open)) *
                100
              ).toFixed(2);

              return {
                stockTicker,
                stockName: sdata.result.shortName,
                stockPrice: sdata.result.currentPrice,
                stockMoneyC: stockMoneyC.toFixed(2),
                stockPChange: Number(stockPChange).toFixed(2),
              };
            }
            return null;
          })
        ),
      ]);

      setTopGainersF(gainersData.filter((stock) => stock !== null));
      setTopLosersF(losersData.filter((stock) => stock !== null));
      setLoading(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Initial fetch of top gainers and losers
  useEffect(() => {
    fetchTopGainers();
    fetchTopLosers();
  }, []);

  useEffect(() => {
    console.log(topGainersF);
    console.log(topLosersF);
  }, [topGainersF, topLosersF]);

  // Uncomment Afterwards
  // useEffect(() => {
  //   if (topGainers.length > 0 || topLosers.length > 0) {
  //     const intervalId = setInterval(() => {
  //       fetchAllData();
  //     }, 10000);

  //     return () => clearInterval(intervalId); // Clean up on unmount
  //   }
  // }, [topGainers, topLosers]);

  useEffect(() => {
    fetchAllData(); // Initial fetch
  }, [topGainers, topLosers]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="bhaiK">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search stocks..."
        />
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((stock, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSuggestionClick(stock)}
              >
                {stock["NAME OF COMPANY"]}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bothB">
        <p className="headN">Nifty 200 Top Gainers</p>
        <div className="gainersE">
          {topGainersF.length > 0 ? (
            topGainersF.map((gainer, index) => (
              <div key={index} className="gainerChild">
                <p className="stockTickerH">{gainer.stockTicker}</p>
                <p className="stockPriceH">₹{gainer.stockPrice}</p>
                <p className="stockMoneyCHG">+₹{gainer.stockMoneyC}</p>
                <p className="stockPerHG">{gainer.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader1">Loading Stocks...</div>
          )}
        </div>

        <p className="headN">Nifty 200 Top Losers</p>
        <div className="losersE">
          {topLosersF.length > 0 ? (
            topLosersF.map((loser, index) => (
              <div key={index} className="loserChild">
                <p className="stockTickerH">{loser.stockTicker}</p>
                <p className="stockPriceH">₹{loser.stockPrice}</p>
                <p className="stockMoneyCHL">₹{loser.stockMoneyC}</p>
                <p className="stockPerHL">{loser.stockPChange}%</p>
              </div>
            ))
          ) : (
            <div className="loader1">Loading Stocks...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Search;
