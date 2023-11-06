import React, { useState, useEffect } from 'react';
import DefaultTemplate from '../components/DefaultTemplate';
import axios from 'axios';
import { Col, Row, Button, Card, Modal, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

import ProductList from '../components/ProductList';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import '../style/card.css';
import ProductModal from '../components/ProductModal';

import ProductCard from '../components/ProductList.js';


const calculateSpan = (cardSize, containerWidth = 1200, gap = 20) => {
  const totalColumnWidth = cardSize.width + gap;
  const numberOfColumns = Math.floor(containerWidth / totalColumnWidth);
  return {
    span: Math.floor(24 / numberOfColumns),
    columns: numberOfColumns
  };
};

const Homepage = () => {
  const [data, setData] = useState([]);
  const [isRearranging, setIsRearranging] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [productCardSize, setProductCardSize] = useState({ width: 150, height: 150 });
  const [categoryCardSize, setCategoryCardSize] = useState({ width: 150, height: 150 });
  const [productColSpan, setProductColSpan] = useState(calculateSpan(productCardSize));
  const [categoryColSpan, setCategoryColSpan] = useState(calculateSpan(categoryCardSize));
  const [categoryCardFontSize, setCategoryCardFontSize] = useState(20);
  const [showShortcutCard, setShowShortcutCard] = useState(true);
  const [shortcutProducts, setShortcutProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [shortcutCards, setShortcutCards] = useState([]);
  const [selectedShortcutProduct, setSelectedShortcutProduct] = useState(null);
  const placeholderImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCcwLprhD5TihUo3e4H82rSk7hk5LD_5PGwA&usqp=CAU';

  const dispatch = useDispatch();

  console.log('Re-rendering Homepage');

  useEffect(() => {
    console.log("Updated shortcut cards:", shortcutCards);
    localStorage.setItem('shortcutCards', JSON.stringify(shortcutCards));
}, [shortcutCards]);

useEffect(() => {
  const loadedShortcutCards = localStorage.getItem('shortcutCards');
  if (loadedShortcutCards) {
      setShortcutCards(JSON.parse(loadedShortcutCards));
  }
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'LOADING_SHOW', payload: true });
        const { data } = await axios.get('/api/products/getproducts');
        console.log('Fetched Data:', data);
        setData(data);
        dispatch({ type: 'LOADING_HIDE' });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);
  

  const dataByCategory = data.reduce((acc, product) => {
    const categoryName = product.category ? product.category.name : 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  useEffect(() => {
    setCategories(Object.keys(dataByCategory));
  }, [data]);

  const handleCategoryClick = (event, categoryName) => {
    event.stopPropagation();
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
  };

  useEffect(() => {
    const handleResize = () => {
      const { span: newProductColSpan, columns: newColumns } = calculateSpan(productCardSize, window.innerWidth);
      const { span: newCategoryColSpan } = calculateSpan(categoryCardSize, window.innerWidth);
      
      
      setShowShortcutCard(newColumns <= 5); 
      
      setProductColSpan(newProductColSpan);
      setCategoryColSpan(newCategoryColSpan);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [productCardSize, categoryCardSize]);


  useEffect(() => {
    const resetActiveCategory = (event) => {
      const clickedElementId = event.target.id;
      if (clickedElementId !== "increase-size-button" && clickedElementId !== "decrease-size-button") {
        setActiveCategory(null);
      }
    };
    window.addEventListener('click', resetActiveCategory);
    return () => {
      window.removeEventListener('click', resetActiveCategory);
    };
  }, []);

  useEffect(() => {
    console.log("Updated shortcut cards:", shortcutCards);
  }, [shortcutCards]);
  
  useEffect(() => {
    console.log("Updated selected shortcut product:", selectedShortcutProduct);
  }, [selectedShortcutProduct]);
  

  const onDragEnd = (result) => {
    const { destination, source, type } = result;
  
    if (!destination) {
      return;
    }
  
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
  
    if (type === 'CATEGORY') {
      const reorderedCategories = Array.from(categories);
      const [removed] = reorderedCategories.splice(source.index, 1);
      reorderedCategories.splice(destination.index, 0, removed);
      setCategories(reorderedCategories);
      return;
    }
  
    if (type.startsWith('category-')) {
      const activeCategory = type.split('-')[1];
      const products = dataByCategory[activeCategory];
      const reorderedProducts = Array.from(products);
      const [removed] = reorderedProducts.splice(source.index, 1);
      reorderedProducts.splice(destination.index, 0, removed);
      setData((prevData) => {
        const newData = [...prevData];
        const categoryIndex = newData.findIndex(product => product.category.name === activeCategory);
        newData.splice(categoryIndex, reorderedProducts.length, ...reorderedProducts);
        return newData;
      });
    }
  };

  const handleSizeChange = (isIncreasing, event) => {
    event.stopPropagation();
    const adjustBy = isIncreasing ? 50 : -50;
    const newSize = Math.max(categoryCardSize.width + adjustBy, 50);
    setCategoryCardSize({
      width: newSize,
      height: newSize,
    });
  };

  const handleShortcutClick = () => {
    setShowProductModal(true);
  };

  const handleProductSelect = (product) => {
    if (shortcutCards.some(shortcut => shortcut._id === product._id)) {
        console.log("Product is already a shortcut. Not adding again.");
        return;
    }
    const newShortcutCards = [...shortcutCards, product];
    setShortcutCards(newShortcutCards);
    setShowProductModal(false);
  };
  
    
  

  useEffect(() => {
    const newProductColSpan = calculateSpan(productCardSize);
    const newCategoryColSpan = calculateSpan(categoryCardSize);
    setProductColSpan(newProductColSpan);
    setCategoryColSpan(newCategoryColSpan);
  }, [productCardSize, categoryCardSize]);

  console.log('Visibility of ProductModal:', showProductModal);


  return (
    <DefaultTemplate>
    <Row align="middle" justify="space-between">
         <Space size={20}>
             <Button id="increase-size-button" onClick={(e) => handleSizeChange(true, e)}>
                 <ZoomInOutlined />
             </Button>
             <Button id="decrease-size-button" onClick={(e) => handleSizeChange(false, e)}>
                 <ZoomOutOutlined />
             </Button>
         </Space>
         <Button type="primary" id="manage-shortcuts" onClick={handleShortcutClick}>Manage Shortcuts</Button>
     </Row>
      <Modal title="Select Category" visible={showCategoryModal} onCancel={() => setShowCategoryModal(false)}>
      <ProductModal
  visible={showProductModal}
  products={data}
  cardSize={productCardSize}
  colSpan={productColSpan}
  onCancel={() => setShowProductModal(false)}
  onProductSelect={handleProductSelect}
/>
<div id="receipt-root"></div>

        {/*category selection form*/}
      </Modal>
      <DragDropContext onDragEnd={onDragEnd}>
        {activeCategory === null ? (
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <Row ref={provided.innerRef} {...provided.droppableProps} gutter={4}>
                {categories.map((categoryName, index) => (
                  <Col key={categoryName} xs={24} md={categoryColSpan}>
                    <Card
                      className={`card ${activeCategory === categoryName ? 'active' : ''}`}
                      style={{ width: `${categoryCardSize.width}px`, height: `${categoryCardSize.height}px` }}
                      onClick={(e) => handleCategoryClick(e, categoryName)}
                    >
                       <h2 className="card-text">{categoryName}</h2>
                    </Card>
                  </Col>
                ))}{shortcutCards.map((product) => (
                  <Col key={product._id} xs={24} md={categoryColSpan}>
                    <ProductCard product={product} />
                  </Col>
                ))}


                {showShortcutCard && (
                  <Col xs={24} md={categoryColSpan}>
                    <Card
                      className="card"
                      style={{
                        width: `${categoryCardSize.width}px`,
                        height: `${categoryCardSize.height}px`,
                      }}
                      onClick={handleShortcutClick}
                    >
                      <h2 style={{ fontSize: `${categoryCardFontSize}px` }}>Shortcut</h2>
                    </Card>
                  </Col>
                )}
                {provided.placeholder}
              </Row>
            )}
          </Droppable>
        ) : (
          <Droppable droppableId={`category-${activeCategory}`} key={activeCategory}>
            {(provided) => (
              <Row ref={provided.innerRef} {...provided.droppableProps}>
                <Col xs={24} md={categoryColSpan}>
                  <Card
                    className="category-card active"
                    style={{ width: `${categoryCardSize.width}px`, height: `${categoryCardSize.height}px` }}
                    onClick={(e) => handleCategoryClick(e, activeCategory)}
                  >
                    <h2>{activeCategory}</h2>
                  </Card>
                  
                </Col>
                <ProductList
                  products={dataByCategory[activeCategory]}
                  cardSize={productCardSize}
                  colSpan={productColSpan}
                  isRearranging={isRearranging}
                />
                {provided.placeholder}
              </Row>
              
            )}
          </Droppable>
        )}
             <ProductModal
      visible={showProductModal}
      products={data}
      cardSize={productCardSize}
      colSpan={productColSpan}
      onCancel={() => setShowProductModal(false)}
      onProductSelect={handleProductSelect}
    />
      </DragDropContext>
 
    </DefaultTemplate>
  );
};

export default Homepage;