import React, {useEffect} from 'react';
import { Input, Form, Button } from 'antd';
import {  useNavigate } from "react-router-dom";
import { useDispatch,  } from 'react-redux';
import { message } from 'antd';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useContext } from 'react'; 

const Login = (value) => {
const { setCurrentUser } = useContext(UserContext);;  
const dispatch = useDispatch()
const navigate = useNavigate()

const handleSubmit = async (value) => {
    try {
        console.log("Full value object:", value);
        console.log("Type of received PIN:", typeof value.pin);
        console.log("Submitting PIN:", value);
        
        // Converts pin to string before sending
        value.pin = String(value.pin).trim();
        console.log("Value passed to Axios:", value);
        
        dispatch({ type: 'LOADING_SHOW' });
        
        // Passes the pin directly as a string
        const res = await axios.post("/api/users/login", { pin: value.pin });
        console.log("Response from server:", res);
        console.log('Response data:', res.data);


        if (res.status === 200 && res.data.message === 'Login successful') {
            message.success("Logging in");
            localStorage.setItem('auth', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);  // Saves the token in local storage
            setCurrentUser(res.data.user);  // Sets the user data in context
            navigate('/');
        } else {
            throw new Error(res.data.message);
        }
        
        
    } catch (error) {
        console.error(error);
        message.error(error.message || 'Error logging in');
    } finally {
        dispatch({ type: 'LOADING_HIDE' });
    }
};



useEffect(() => {
  if (localStorage.getItem('auth')){
      localStorage.getItem('auth');
      navigate('/menu');
  }
}, [navigate]);


  return (
    <>
      <div className="login
      ">
        <h1>TabPoint</h1>
        
        
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="pin" label="Pin">
            <Input type="password" inputMode="numeric" pattern="[0-9]*" />
        </Form.Item>
          <div className="d-flex justify-content-center">

            <div className="login-button">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
