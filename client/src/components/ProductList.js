import React from 'react';
import { Card, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

const { Meta } = Card;

// ProductCard.js
export const ProductCard = ({ product, cardSize, index, isRearranging, colSpan, imageVisible = true }) => {
  console.log('Rendering ProductCard:', product.name);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
  };

  const shouldHideImage = cardSize.width < 100;
  return (
    <Draggable draggableId={String(product._id)} index={index} isDragDisabled={!isRearranging}>
      {(provided) => (
        <div {...provided.draggableProps} ref={provided.innerRef} onClick={handleAddToCart}>
          <div {...provided.dragHandleProps}>
            <Card
              hoverable
              className={`product-card ${isRearranging ? 'rearranging' : ''}`}
              style={{ width: cardSize.width, height: cardSize.height, marginBottom: 5, borderRadius: 10 }}
            >
              {!imageVisible || shouldHideImage ? null : (
    <img 
      src={product.image} 
      alt={product.name} 
      style={{ 
        width: colSpan > 4 ? '50%' : '100%', 
        height: 'auto' 
      }} 
    />
)}

              <Meta title={product.name} description={product.price ? `${product.price} €` : ''} />
            </Card>
          </div>
        </div>
      )}
    </Draggable>
  );
};


// ProductList.js
const ProductList = ({ products, cardSize, colSpan, isRearranging }) => {

  
  console.log("colSpan in ProductList: ", colSpan); // Debug point 1

  return (
    <Row gutter={[16, 16]}>
      {products?.map((product, index) => (
        <Col key={product._id} xs={24} md={colSpan}>
          <ProductCard
            product={product}
            cardSize={cardSize}
            index={index}
            isRearranging={isRearranging}
            colSpan={colSpan}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
