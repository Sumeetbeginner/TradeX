import React, { useEffect, useState , useContext} from "react";
import SearchBar from "../Search/SearchBar";
import "./home.css";
import Nifty from "./Nifty";
import {UserContext} from '../../UserContext'

const Home = () => {

  const { user } = useContext(UserContext);
  const [newsD, setNewsD] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3000/stocknews", {
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
        setNewsD(data.news);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="homeBody">
      <div className="homeSearch">
        <SearchBar />
        <div className="accBal">
         🪙 Balance : ₹{Number(user.balance).toFixed(2)}
        </div>
      </div>
      <div className="flexCHome">
        <div className="othersLeft">
          <Nifty />
        </div>
        <div className="newsRight">
          {loadingNews ? (
            <div className="loader"></div>
          ) : newsD.length > 0 ? (
            <div className="newsContainer">
              {newsD.map((news, index) => (
                <div key={index} className="newsBro">
                  <a target="_blank" href={news.href} className="flexNewsC">
                    <img src={news.img_src} alt={news.title} />
                    <p>{news.title}</p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="noNews">No news available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
