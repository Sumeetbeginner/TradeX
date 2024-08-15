import React, { useEffect, useState, useContext } from "react";
import SearchBar from "../Search/SearchBar";
import "./home.css";
import Nifty from "./Nifty";
import { UserContext } from "../../UserContext";
import "./mhome.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js";

const Home = () => {
  const { user } = useContext(UserContext);
  const [newsD, setNewsD] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://tradexservers.vercel.app/stocknews", {
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

  const applyLogout = async () => {
    try {
      localStorage.removeItem(
        "firebase:host:tradezone3690-default-rtdb.firebaseio.com"
      );
      await signOut(auth);
      console.log("✅ User logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const location = useNavigate();

  return (
    <div className="homeBody">
      <div className="homeSearch">
        <div className="searchbhai">
          <SearchBar />
        </div>
        <div className="mobilebhai">
          <i className="fas fa-cog" onClick={() => location("/setting")}></i>

          <i className="fa-solid fa-power-off" onClick={() => applyLogout()}></i>
        </div>

        <div className="accBal">
          🪙 <span>Balance : </span>₹{Number(user.balance).toFixed(2)}
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
