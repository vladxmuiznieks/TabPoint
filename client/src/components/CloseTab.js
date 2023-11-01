import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTab } from '../redux/store';
import '../style/CloseTab.css';
import axios from 'axios'

const CloseTabOverlay = ({ totalCost = 0, cartItems, closeModal }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const dispatch = useDispatch();

  const selectedTabId = useSelector((state) => state.rootReducer.selectedTable?.tabId);
  
  const changeOwed = amountPaid - totalCost;

  const handleAmountPaidChange = (e) => {
    const amount = parseFloat(e.target.value);
    setAmountPaid(amount);
  };

  const handleCloseTab = async (tabId) => {
    console.log('Selected Tab ID:', tabId);
    try {
      if(tabId === undefined) {
        console.error('Tab ID is undefined');
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/tabs/closetab/${tabId}`);
      dispatch(closeTab(response.data.tab));
    } catch (error) {
      console.error('Error closing tab:', error);
    }
  };

  return (
    <div className="close-tab-overlay">
      <div>
        <input
          type="number"
          value={amountPaid}
          onChange={handleAmountPaidChange}
          placeholder="Enter amount paid"
        />
        <p>Total Cost: €{(totalCost ? totalCost.toFixed(2) : '0.00')}</p>
        {changeOwed < 0 && <p>Amount Due: €{(-changeOwed ? changeOwed.toFixed(2) : '0.00')}</p>}
        {changeOwed > 0 && <p>Change Owed: €{(changeOwed ? changeOwed.toFixed(2) : '0.00')}</p>}
        <button className="close-tab-btn" onClick={() => handleCloseTab(selectedTabId)}>Close Tab</button>
        <button className="cancel-btn" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default CloseTabOverlay;
