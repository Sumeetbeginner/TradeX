import React, { useContext } from 'react';
import './wallet.css';
import { UserContext } from '../../UserContext';
import BarChart from './BarChart';
import PieChart from './PieChart';

const Wallet = () => {
  const { user } = useContext(UserContext);
  const transactions = user.transactions || [];

  // Format Currency for better presentation
  function formatCurrency(amount) {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount);
    }
    if (isNaN(amount)) return 'Invalid number';
  
    const [integerPart, decimalPart] = amount.toFixed(2).split('.');
  
    let lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
  
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
  
    const result =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
    return `₹${result}.${decimalPart}`;
  }

  return (
    <div className='walletui'>
      <div className="flexui">
        <div className="leftWallet">
          <div className='graphHist'>
            {transactions.length > 0 ? (
              <BarChart transactions={transactions} />
            ) : (
              <p>No transaction data available for Bar Chart.</p>
            )}
          </div>
          <div className='pieHist'>
            {transactions.length > 0 ? (
              <PieChart transactions={transactions} />
            ) : (
              <p>No transaction data available for Pie Chart.</p>
            )}
          </div>
        </div>

        <div className="rightWallet">
          <h2 className="balanceH">Account Balance</h2>
          <h1 className='balanceRs'>{formatCurrency(Number(user.balance))}</h1>

          <h2 className='thTop'>Transaction History</h2>
          <div className="transHis">
            {transactions.length > 0 ? (
              transactions.slice().reverse().map((transaction, index) => (
                <div
                  className='transactionS'
                  key={index}
                >
                  <p id='transM'>{transaction.transMess}</p>
                  <p id='transA' style={{
                    color: transaction.transStatus === 'debit' ? 'red' : 'green',
                  }}>{formatCurrency(transaction.transAmt)}</p>
                </div>
              ))
            ) : (
              <p>No transactions available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
