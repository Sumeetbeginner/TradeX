import React, { useContext } from 'react';
import './wallet.css';
import { UserContext } from '../../UserContext';

const Wallet = () => {
  const { user } = useContext(UserContext);

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
            Bar Chart of Last 5 Transactions
          </div>
          <div className='pieHist'>Pie Chart of Last 30 Transactions Profit/loss</div>
        </div>

        <div className="rightWallet">
          <h2 className="balanceH">Account Balance</h2>
          <h1 className='balanceRs'>{formatCurrency(Number(user.balance))}</h1>

          <h2 className='thTop'>Transaction History</h2>
          <div className="transHis">
            {user.transactions.map((transaction, index) => (
              <div
                className='transactionS'
                key={index}
                
              >
                <p id='transM'>{transaction.transMess}</p>
                <p id='transA' style={{
                  color: transaction.transStatus === 'debit' ? 'red' : 'green',
                }}>{formatCurrency(transaction.transAmt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
