import React from 'react';
import { Input, Form, Button, Select } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import axios from 'axios';

const Register = () => {
const dispatch = useDispatch();
const navigate = useNavigate();


  const handleSubmit = async (value) => {
    try {
        dispatch({ type: 'LOADING_SHOW' });
        await axios.post("/api/users/register", value);
        message.success("User has been registered");
        navigate('/login');
        dispatch({ type: 'LOADING_HIDE' });
      } catch (error) {
        console.error(error);
        message.error('User was not registered, please contact administrator!');
        dispatch({ type: 'LOADING_HIDE' });
      }
  };

  


  return (
    <>
      <div className="register">
        <h1>TabPoint</h1>
        <h3>Welcome to Registration!</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="pin" label="Pin">
            <Input type="password" inputMode="numeric" pattern="[0-9]*" />
        </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
            </Select>
          </Form.Item>
          <div className="d-flex justify-content-center">
            <p>
                User has already been registered!
                <Link to="/login">     Login here
                </Link>
            </p>

            <div className="register-button">
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
    
  );
  };

  export default Register;
