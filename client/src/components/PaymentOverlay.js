import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableSelect from '../components/TableSelect';
import '../style/PaymentOverlay.css';
import { addTab, fetchTables, addSale } from '../redux/store';

const PaymentOverlay = ({ totalCost =0, cartItems, closeModal }) => {
  const [amountPaid, setAmountPaid] = useState(0);
  const dispatch = useDispatch();

  // Retrieve the selectedTable from the state
  const selectedTable = useSelector(state => state.rootReducer.selectedTable);
  console.log('Selected Table in Payment Overlay:', selectedTable);

  const changeOwed = amountPaid - totalCost;

  const handlePayment = () => {
    if (amountPaid >= totalCost) {
      if (!selectedTable) {
        alert('Please select a table before confirming the payment.');
        return;
      }
      
      const saleDetails = {
        items: cartItems,
        totalAmountDue: totalCost,
        amountPaid,
        changeOwed,
        tableNo: selectedTable.tableNumber,
     };
     
    

      console.log(saleDetails);
      dispatch(addSale(saleDetails)); // Add sale to the database
      dispatch({ type: 'CLEAR_CART' });
      closeModal();
    } else {
      alert('Insufficient amount paid');
    }
  };
  
  

  useEffect(() => {
    dispatch(fetchTables());
}, [dispatch]);

  const handleAmountPaidChange = (e) => {
    const amount = parseFloat(e.target.value);
    setAmountPaid(amount);
  };

  const handleAddToTab = () => {
    if (selectedTable) {
      dispatch(
        addTab({
          items: cartItems,
          totalAmountDue: totalCost,
          amountPaid,
          changeOwed,
          tableNo: selectedTable._id,
        })
      );
      dispatch({ type: 'CLEAR_CART' });
      closeModal();
    } else {
      alert('Please select a table before adding to tab');
    }
  };
  

  return (
    <div className="payment-overlay">
      <div>
        <input 
          type="number" 
          value={amountPaid} 
          onChange={handleAmountPaidChange} 
          placeholder="Enter amount paid"
        />
        <TableSelect />
        {changeOwed > 0 && <p>Change Owed: €{changeOwed.toFixed(2)}</p>}
        <button className="confirm-btn" onClick={handlePayment}>Confirm Payment</button>
        <button className="add-to-tab-btn" onClick={handleAddToTab}>Add to Tab</button>
        <button className="cancel-btn" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default PaymentOverlay;