import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTab, addSale, removeTab } from '../redux/store';
import '../style/CloseTab.css';
import axios from 'axios'
import ReactDOM from 'react-dom';
import Receipt from '../components/Receipt';

const CloseTabOverlay = ({ tab, closeModal }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const dispatch = useDispatch();
  const totalCost = tab.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const selectedTabId = useSelector((state) => state.rootReducer.selectedTable?.tabId);
  
  const changeOwed = amountPaid - totalCost;
  const entireState = useSelector((state) => state);
  console.log('Entire State:', entireState);
  
 

  const handleAmountPaidChange = (e) => {
    const amount = parseFloat(e.target.value);
    setAmountPaid(amount);
  };

  const ReceiptPortal = ({ sale, onClose }) => {
    useEffect(() => {
      const printWindow = window.open('', '_blank', 'height=600,width=800');
      
      ReactDOM.render(<Receipt sale={sale} />, printWindow.document.body, () => {
        printWindow.focus(); // Focus on the window
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          onClose();
        };
      });
      
    }, [sale, onClose]);
  
  
    return null;
  };

  const handlePrintReceipt = (sale) => {
    ReactDOM.render(
      <ReceiptPortal sale={sale} onClose={() => ReactDOM.unmountComponentAtNode(document.getElementById('receipt-root'))} />,
      document.getElementById('receipt-root')
    );
  };
  
  
  const handleCloseTab = async (tab) => {
    const tabId = tab?._id;
    const saleDetails = {
      items: tab.items,
      totalAmountDue: totalCost,
      amountPaid,
      changeOwed,
      tableNo: selectedTabId,
    };
  
    try {
      if (tabId === undefined) {
        console.error('Tab ID is undefined');
        return;
      }
  
      handlePrintReceipt(saleDetails);
  
      const payload = {
        amountPaid: amountPaid,
      };
  
      const response = await axios.put(`http://localhost:5000/api/tabs/closetab/${tabId}`, payload);
      if (response.status === 200) {
        dispatch(addSale(saleDetails)); 
        dispatch(removeTab(tabId)); 
      }
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
        <div id="receipt-root"></div>
        <p>Total Cost: €{totalCost.toFixed(2)}</p>
        {changeOwed < 0 && <p>Amount Due: €{(-changeOwed ? changeOwed.toFixed(2) : '0.00')}</p>}
        {changeOwed > 0 && <p>Change Owed: €{(changeOwed ? changeOwed.toFixed(2) : '0.00')}</p>}
        <button className="close-tab-btn" onClick={() => handleCloseTab(tab)}>Close Tab</button>
        <button className="cancel-btn" onClick={closeModal}>Cancel</button>
      </div>


    </div>
  );
};

export default CloseTabOverlay;
