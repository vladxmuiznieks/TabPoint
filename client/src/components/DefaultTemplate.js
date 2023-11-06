import {Link, useNavigate} from "react-router-dom";
import { UserContext } from '../UserContext';
import { useContext } from 'react'; 
import {

    UserOutlined,
    HomeOutlined,
    CreditCardOutlined,
    CoffeeOutlined,
    EuroOutlined,
    SettingOutlined,
    DeleteOutlined
  } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import "../style/DefaultTemplate.css";
import Spinner from './Spinner';

const { Header, Content } = Layout;



const DefaultTemplate = ({ children }) => {
  const { cartItems, loading } = useSelector(state => state.rootReducer);
  const navigate = useNavigate();
  

  const { currentUser } = useContext(UserContext); // Get currentUser from the context

  const  {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem('cartItems',JSON.stringify(cartItems)) 
  }, [cartItems]);

  const totalCost = cartItems.reduce((acc, currentItem) => {
    return acc + (currentItem.quantity * currentItem.price);
  }, 0);

  return (
    <Layout>
        {loading && <Spinner />}
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}
        >
            <div className="headers-content">
                <div className="logo-section">
                    <h1 className="text-center text-light font-weight-bold">.</h1>
                    {currentUser && 
                        <div className="welcome-message">
                        </div>
                    }
                </div>
                <Menu
  theme="light"
  mode="horizontal"
  defaultSelectedKeys={window.location.pathname}
  style={{ lineHeight: '64px', display: 'inline-block' }}
>
   <Menu.Item key="tabPointEPOS">
    TabPoint EPOS
    <Link to="/settings"></Link>
  </Menu.Item>
  
  <Menu.Item key="/" icon={<HomeOutlined/>}>
    <Link to="/">Dashboard</Link>
  </Menu.Item>
  <Menu.Item key="/" icon={<DeleteOutlined/>}>
    <Link to="/">Waste Book</Link>
  </Menu.Item>
  <Menu.Item key="/tabs" icon={<CreditCardOutlined />}>
    <Link to="/tabs">Tabs</Link>
  </Menu.Item>
  <Menu.Item key="/menu" icon={<CoffeeOutlined />}>
    <Link to="/menu">Menu</Link>
  </Menu.Item>
  <Menu.Item key={4} icon={<UserOutlined />}
  onClick={() => {
    localStorage.removeItem('auth')
    navigate('/login');
  }}
>
  {currentUser ? currentUser.name : "Login"}
  </Menu.Item>
  <Menu.Item key="totalCost">
  <Link to="/sale">Total: €{totalCost.toFixed(2)}</Link>
</Menu.Item>




</Menu>

                <div className="cart-item-section">
                    <div className="cart-item d-flex justify-content-space-between flex-row" 
                        onClick={() => navigate('/sale')}
                        style={{alignItems: 'center'}}
                    >
                        {/* <EuroOutlined />
                        <p style={{ margin: 0 }}>{totalCost.toFixed(2)}</p> */}
                    </div>
                </div>
            </div>
        </Header>
        <Content 
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
            }}
        >
            {children}
        </Content>
    </Layout>
);
};

export default DefaultTemplate;