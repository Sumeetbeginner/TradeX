import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChart = ({ transactions }) => {
  // Get the last 5 transactions
  const lastFiveTransactions = transactions.slice(-5).reverse();

  // Function to get the last word of a string
  const getLastWord = (str) => {
    const words = str.split(' ');
    return words[words.length - 1];
  };

  const data = {
    labels: lastFiveTransactions.map(transaction => getLastWord(transaction.transMess)),
    datasets: [
      {
        label: 'Transaction Amount',
        data: lastFiveTransactions.map(transaction => transaction.transAmt),
        backgroundColor: lastFiveTransactions.map(transaction =>
          transaction.transStatus === 'debit' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 128, 0, 0.2)'
        ),
        borderColor: lastFiveTransactions.map(transaction =>
          transaction.transStatus === 'debit' ? 'red' : 'green'
        ),
        borderWidth: 1,
    
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
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
