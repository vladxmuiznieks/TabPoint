
import React from 'react';
import { Modal, Row, Col } from 'antd';
import { Table } from 'antd';
import { useDispatch } from 'react-redux';

console.log('Re-rendering ProductModal');


const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text) => `${text} €`,
    },
  ];
  
  const ProductModal = ({ visible, products, onCancel, onProductSelect }) => {
    const dispatch = useDispatch(); 
    const handleAddToCart = (record) => {
      dispatch({ type: 'ADD_TO_CART', payload: { ...record, quantity: 1 } });
    };
  
    const ClickableRow = ({ index, children, record }) => {
        return (
          <tr 
            onClick={() => {
              handleAddToCart(record);
              onProductSelect(record);
            }}
          >
            {children}
          </tr>
        );
      };
      const handleRowClick = (record, rowIndex) => {
        console.log("Row clicked: ", record, rowIndex);
        onProductSelect(record);
      };
      
  
    return (
      <Modal title="Select a Product" visible={visible} onCancel={onCancel}>
        <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: () => handleRowClick(record, rowIndex),
          };
        }}
        columns={columns}
        dataSource={products}
      />
    </Modal>
  );
};
  
  export default ProductModal;
