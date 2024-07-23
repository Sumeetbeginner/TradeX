import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import stocksData from "../../assets/data/nse.json"; 
import "./search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Loaded stocks data:", stocksData);
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
    console.log("Selected stock:", stock); 
    localStorage.setItem('currStockData', stock.SYMBOL)
    navigate("/stockinfo");
  };

  return (
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
  );
};

export default Search;
