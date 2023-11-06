import React, { useState }from 'react';
import DefaultTemplate from '../components/DefaultTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import { DeleteOutlined, LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; 
import PaymentOverlay from '../components/PaymentOverlay'
import { Button } from 'antd';

const Sale = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [isPaymentOverlayOpen, setPaymentOverlayOpen] = useState(false)

  const totalCost = cartItems.reduce((acc, currentItem) => {
    return acc + (currentItem.quantity * currentItem.price);
  }, 0);

  const openPaymentOverlay = () => {
    setPaymentOverlayOpen(true);
  };

  const closePaymentOverlay = () => {
    setPaymentOverlayOpen(false);
  };

  const handleIncrement = (record) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity === 1) {
      dispatch({
        type: 'DELETE_CART',
        payload: record,
      });
    } else {
      dispatch({
        type: 'UPDATE_CART',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: '',
      dataIndex: 'image',
      render: (image, record) => <img src={image} alt={record.name} height="75" width="75" />,
    },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <LeftSquareOutlined className="ux-1" style={{ cursor: 'pointer' }} onClick={() => handleDecrement(record)} />
          <RightSquareOutlined className="ux-1" style={{ cursor: 'pointer' }} onClick={() => handleIncrement(record)} />
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() => dispatch({ type: 'DELETE_CART', payload: record })}
        />
      ),
    },
  ];

  return (
    <DefaultTemplate>
    {/*wrap button and the heading*/}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <h2 style={{ margin: 0 }}>Open Sale € {totalCost.toFixed(2)}</h2>
      <Button type="primary"
        className="all-sales-btn"
        onClick={() => navigate('/sales-display')}
      >
        All Sales
      </Button>
    </div>
      <Table columns={columns} dataSource={cartItems} bordered />
      <button className="proceed-to-payment-btn" onClick={openPaymentOverlay}>Proceed to Payment</button>
      
      
      


      {isPaymentOverlayOpen && (
        <PaymentOverlay
          totalCost={totalCost}
          cartItems={cartItems}
          closeModal={closePaymentOverlay}
        />
      )}
    </DefaultTemplate>
    
  );
  
};


export default Sale;