import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
// import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const StockDataA = ({ closePopup }) => {
  const [timeframe, setTimeframe] = useState("1mo"); // Default to 1 week
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currStockData = localStorage.getItem("currStockData"); // Assume this is a simple string

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (currStockData) {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            "https://tradexservers.vercel.app/historicaldata", // Use HTTP for local development
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                stockTicker: currStockData,
                period: timeframe,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log(data);
          
          const labels = data.historical_data.map((item) => {
            const date = new Date(item.Date);
            return date.toDateString().slice(4); // Trim the weekday name
          });
          const prices = data.historical_data.map((item) => item.Close);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: `Stock Price (${timeframe})`,
                data: prices,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Background color below the line
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching historical data:", error);
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHistoricalData();

    return () => {
      setLoading(false);
      setError(null);
    };
  }, [timeframe, currStockData]);

  const options = {
    scales: {
      x: {
        type: "category", // Change this to 'time' if your labels are date strings
        title: {
          display: false, // Hide the x-axis title
        },
      },
      y: {
        title: {
          display: false, // Hide the y-axis title
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const fullDate = new Date(tooltipItems[0].label);
            const formattedDate = fullDate.toDateString();
            return formattedDate.slice(4); // Trim the weekday name
          },
          label: function (tooltipItem) {
            return `Price: ${Number(tooltipItem.raw).toFixed(2)}`;
          },
        },
      },
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: false, // Hide the chart title
      },
    },
  };

  return (
    <div className="popup-container ">
      <div className="popup-box makeitbig">
        <div className="topBuy">
          <h2>{currStockData}</h2>
          <i id="closeP" onClick={closePopup} className="fa-solid fa-xmark"></i>
        </div>

        <div className="timeframe-buttons">
          {/* <button
            onClick={() => setTimeframe("1wk")}
            className={timeframe === "1wk" ? "active" : ""}
          >
            1 Week
          </button> */}
          <button
            onClick={() => setTimeframe("1mo")}
            className={timeframe === "1mo" ? "active" : ""}
          >
            1 Month
          </button>
          <button
            onClick={() => setTimeframe("1y")}
            className={timeframe === "1y" ? "active" : ""}
          >
            1 Year
          </button>
          <button
            onClick={() => setTimeframe("max")}
            className={timeframe === "max" ? "active" : ""}
          >
            Max
          </button>
        </div>

        {loading ? (
          <p>Loading chart data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default StockDataA;
