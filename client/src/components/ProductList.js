import React from 'react';
import { Card, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

const { Meta } = Card;
const placeholderImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCcwLprhD5TihUo3e4H82rSk7hk5LD_5PGwA&usqp=CAU';
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
      className="card-image"
      src={product.image || placeholderImageUrl}
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = placeholderImageUrl; 
      }}
      alt={product.name} 
      style={{ 
        width: colSpan > 4 ? '50%' : '100%', 
        height: 'auto' 
      }} 
    />
)}

            <Meta
              className="card-text"
              title={product.name}
              description={product.price ? `${product.price} €` : ''}
            />
            </Card>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const ProductList = ({ products, cardSize, colSpan, isRearranging }) => {

  
  console.log("colSpan in ProductList: ", colSpan); 

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
