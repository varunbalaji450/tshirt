import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { setName } from '../redux/userSlice';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const onFinish = (values) => {
    setLoading(true);
    const temp = {
      email: values?.email,
      password: values?.password,
    };
    axios
      .post('http://127.0.0.1:8000/user_login/', temp)
      .then((res) => {
        setLoading(false);
        message.success('Login Success', 1);
        dispatch(setName(res?.data.user_name));
        navigate('/home');
        console.log(res?.data.user_name);

      })
      .catch((error) => {
        setLoading(false);
        message.error('Invalid Credentials', 1);
        console.error('Login error:', error);
      });
  };
 
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <div style={{ marginRight: '20px' }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s"
            alt="Logo"
            style={{ width: '100px', height: '50px', cursor: 'pointer' }}
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
        <Typography.Title level={2} style={{ marginLeft: '120px' }}>
          Data Migration - Effort and Estimation Report
        </Typography.Title>
      </div>
 
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 91px)', // Adjust height for the top bar
          backgroundColor: '#f0f2f5',
        }}
      >
        <div
          style={{
            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            Login
          </Typography.Title>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Enter a valid Email' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
                style={{ width: '100%' }}
              >
                Log in
              </Button>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                }}
              >
                <a className="login-form-forgot" href="/forgot">
                  Forgot user
                </a>
                <Link to="/signUp">Sign Up</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
 
export default LoginPage;
 