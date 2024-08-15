import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StockLineChart = ({ stockData }) => {
  const { open, dayLow, dayHigh, currPrice, percentageChange } = stockData;

  const chartColor = percentageChange >= 0 ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';

  const data = {
    labels: ['Open', 'Low', 'High', 'Current'],
    datasets: [
      {
        data: [open, dayLow, dayHigh, currPrice],
        borderColor: percentageChange >= 0 ? 'green' : 'red',
        backgroundColor: chartColor,
        pointBackgroundColor: percentageChange >= 0 ? 'green' : 'red',
        pointBorderColor: percentageChange >= 0 ? 'green' : 'red',
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        min: (dayLow/1.1).toFixed(2),
        max: (dayHigh*1.1).toFixed(2),
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default StockLineChart;
