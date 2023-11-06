import React from 'react';
import styles from './Receipt.module.css';

const Receipt = ({ sale, totalSalesValue, firstSaleDate, lastSaleDate, items }) => {
  const isXReport = items && !sale; 

  return (
    <div className={styles.receipt}>
      <h1>P. Macs Dundrum{isXReport ? " - X Report" : ""}</h1>
      <p>Date: {isXReport ? `${new Date(firstSaleDate).toLocaleString()} - ${new Date(lastSaleDate).toLocaleString()}` : new Date(sale.saleDate).toLocaleString()}</p>
      {isXReport ? (
        <>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <p>{item.name} x {item.quantity}</p>
              <p>€{item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
          <hr />
          <p className={styles.total}>Total Sales Value: €{totalSalesValue.toFixed(2)}</p>
        </>
      ) : (
        <>
          <p>Table No: {sale.tableNo}</p>
          <hr />
          {sale.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <p>{item.name} x {item.quantity}</p>
              <p>€{item.price.toFixed(2)}</p>
            </div>
          ))}
          <hr />
          <p className={styles.total}>Total Amount Due: €{sale.totalAmountDue?.toFixed(2)}</p>
          <p className={styles.amountPaid}>Amount Paid: €{sale.amountPaid?.toFixed(2)}</p>
          <p className={styles.changeOwed}>Change Owed: €{sale.changeOwed?.toFixed(2)}</p>
        </>
      )}
      <p className={styles.thankYou}>Thank you for your visit!</p>
    </div>
  );
};

export default Receipt;
