import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import axios from 'axios';
 
const { Header, Sider, Content } = Layout;
 
const Report = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [urls, setUrls] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const handleMandatoryImages = async () => {
    // setUrls(data);
    try{
       
        const res = await axios.get('http://127.0.0.1:8000/plot/').then((res)=>{
          console.log(res);
          console.log('Hi raj');
          console.log(res.data.plots.mandatory);
         
          setImageData(res.data.plots);
            // console.log(res.data.plots[0].line_plot);
            // const base64Data = res.data.plots[0].line_plot.trim(); // Remove leading/trailing whitespace
            // const imageSrc = `data:image/png;base64,${base64Data}`;
            // setImageUrl(imageSrc);
            // console.log('response recieved successfully');          
        }).catch(err=>{
            console.log(err);
        })
        console.log(res);
       
    }catch(err){
      console.log('Hello');
     
        console.log(err);        
    }
  };
 
  const handelParentChildData = async ()=>{
    setImageData([]);
  }
  const handelDownload = ()=>{
    const img = imageData.map(img => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/jpeg'); // or image/png
  });
 
 
  }
  const showImage = (url) => {
    setSelectedImage(url);
    setVisible(true);
  };
 
  const handleClose = () => {
    setVisible(false);
    setSelectedImage('');
  };
 
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: '#f0f2f5' }} // Light gray for sidebar
      >
        <div style={{ color: '#000', padding: '16px', textAlign: 'center' }}>
          Sidebar Header
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Menu Item 1</Menu.Item>
          <Menu.Item key="2">Menu Item 2</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: '#fff', padding: 0 }}>
          <Button
            type="default" // Normal button color
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: '16px' }}
          >
            Toggle Sidebar
          </Button>
        </Header>
        <Content style={{ display: 'flex', margin: '24px', padding: 24, backgroundColor: '#fff' }}>
          {/* Left Half for Fixed Buttons */}
          <div style={{ width: '200px', paddingRight: '12px' }}>
            <Button
              type="default" // Normal button color
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              onClick={handleMandatoryImages}
            >
              Get Master Data
            </Button>
            <Button
              type="default" // Normal button color
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              onClick={handleMandatoryImages}
            >
              Get Sales Data
            </Button>
            <Button
              type="default" // Normal button color
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              onClick={handelParentChildData}
            >
              remove images
            </Button>
 
            {/* Additional buttons can be added here */}
          </div>
 
          {/* Right Half for Scrollable Images */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)', paddingLeft: '12px', display: 'flex', flexWrap: 'wrap' }}>
            {imageData!==null && <>
 
           
              <div>
           {/* {imageData.map((imageData, index) => (
              <div key={index} >
                  <h3>{Object.keys(imageData)[0]}</h3>
                  <img src={`data:image/png;base64,${btoa(imageData[Object.keys(imageData)[0]])}`} alt="Plot" />
              </div>
          ))}  */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)', paddingLeft: '12px', display: 'flex', flexWrap: 'wrap' }}>
            {imageData.map((imgUrl, index) => (
              <div
                key={index}
                style={{
                  margin: '10px',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => showImage(imgUrl)} // Show image on click
              >
                <h3>{Object.keys(imgUrl)[0]}</h3>
                <img src={`data:image/png;base64,${btoa(imgUrl[Object.keys(imgUrl)[0]])}`} alt="Plot"
                style={{
                  maxWidth: 150,
                  maxHeight: 150,
                  display: 'block', // Not needed in React Native, remove if it causes issues
                  margin: '0 auto',   // Not needed in React Native, managed by container
                  resizeMode: 'contain', // React Native equivalent of object-fit
                }}/>
              </div>
            ))}
            {/* {imageData!==null && <>
              <div>
           {imageData.map((imageData, index) => (
              <div key={index}>
                  <h3>{Object.keys(imageData)[0]}</h3>
                  <img src={`data:image/png;base64,${btoa(imageData[Object.keys(imageData)[0]])}`} alt="Plot" />
              </div>
          ))}
      </div>
            </>} */}
          </div>
          <div>
            <button onClick={handelDownload}>Download Pdf</button>
          </div>
 
      </div>
            </>}
          </div>
        </Content>
      </Layout>
 
      {/* Modal for Enlarged Image */}
      <Modal
        visible={visible}
        footer={null}
        onCancel={handleClose}
        centered
        width={800}
      >
        <img src={`data:image/png;base64,${btoa(selectedImage[Object.keys(selectedImage)[0]])}`} alt="Plot"
                style={{
                  maxWidth: 450,
                  maxHeight: 450,
                  display: 'block', // Not needed in React Native, remove if it causes issues
                  margin: '0 auto',   // Not needed in React Native, managed by container
                  resizeMode: 'contain', // React Native equivalent of object-fit
                }}/>
        <Button
          type="primary"
          onClick={handleClose}
          style={{ marginTop: '16px' }}
        >
          Close
        </Button>
      </Modal>
    </Layout>
  );
};
 
export default Report;
 
