import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ transactions }) => {
  let totalDebit = 0;
  let totalCredit = 0;

  transactions.forEach((transaction) => {
    if (transaction.transStatus === 'debit') {
      totalDebit += parseFloat(transaction.transAmt);
    } else if (transaction.transStatus === 'credit') {
      totalCredit += parseFloat(transaction.transAmt);
    }
  });

//   console.log('Total Debit:', totalDebit);
//   console.log('Total Credit:', totalCredit);

  const data = {
    labels: ['Debit', 'Credit'],
    datasets: [
      {
        data: [totalDebit, totalCredit],
        backgroundColor: ['rgba(255, 0, 0, 0.2)', 'rgba(0, 255, 0, 0.2)'],
        borderColor: ['red', 'green'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
