import React from "react";
import Search from "../Search/Search";
import SearchBar from "../Search/SearchBar";
import "./home.css";

const Home = () => {

  

  return (
    <div className="homeBody">
      <div className="homeSearch">
        <SearchBar />
      </div>

      <div className="flexCHome">
        <div className="othersLeft"></div>
        <div className="newsRight">News</div>
      </div>
    </div>
  );
};

export default Home;
