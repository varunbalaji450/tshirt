import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const SignupPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
 
  const onFinish = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
 
    axios
      .post('http://127.0.0.1:8000/user_create/', values)
      .then((res) => {
        console.log(res);
        message.success('User created Successfully', 1);
        navigate('/');
      })
      .catch((err) => {
        console.error('Signup error:', err);
        message.error('Email already registered', 1);
      });
  };
 
  const handleLoginRedirect = () => {
    navigate('/');
  };
 
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        <Typography.Title level={2} style={{ flex: 1, textAlign: 'center' }}>
          Data Migration - Effort and Estimation Report
        </Typography.Title>
      </div>
 
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f2f5',
        }}
      >
        <div
          style={{
            width: 600, // Increased width to accommodate side-by-side fields
            padding: 24,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
          <Form form={form} name="signup" onFinish={onFinish} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="user_name"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
 
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
                <Col span={12}>
                <Form.Item
                label="Re-enter Password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                <Input.Password />
                </Form.Item>
              </Col>
            </Row>
 
            
 
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" htmlType="submit">
                  Sign Up
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  Reset
                </Button>
              </div>
            </Form.Item>
 
            <p style={{ textAlign: 'center', marginTop: 16 }}>
              Already registered?{' '}
              <span
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={handleLoginRedirect}
              >
                Login
              </span>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};
 
export default SignupPage;
 