import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const NiftyChart = ({ niftydata }) => {
  if (!niftydata) {
    return null; // or some fallback UI
  }

  console.log("Received data in NiftyChart:", niftydata);  // Log received data

  const { currPrice, dayHigh, previousClose, priceChangePercent } = niftydata;

  const chartColor = priceChangePercent >= 0 ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';

  const data = {
    labels: ['Previous Close', 'Day High', 'Current Price'],
    datasets: [
      {
        label: 'Price',
        data: [previousClose, dayHigh, currPrice],
        borderColor: priceChangePercent >= 0 ? 'green' : 'red',
        backgroundColor: chartColor,
        pointBackgroundColor: priceChangePercent >= 0 ? 'green' : 'red',
        pointBorderColor: priceChangePercent >= 0 ? 'green' : 'red',
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
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
        },
        suggestedMin: previousClose * 0.9, // Adjust the scale to ensure visibility
        suggestedMax: dayHigh * 1.1,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default NiftyChart;
