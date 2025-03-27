import React from 'react';
import { Button, Table, Form, Input,Space ,message } from 'antd';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Alert } from "antd";
import { createStyles } from 'antd-style';
 
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `,
    };
  });
 
const TshirtHome = () => {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [displayDiv, setDisplayDiv] = useState(false);
    const [formValues, setFormValues] = useState({ textField: '' });
    const [loading,setLoading]=useState(false);
    const [errorAlert, setErrorAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const { styles } = useStyle();
   
    useEffect(()=>{
        try{
            axios.get('http://127.0.0.1:8000/project_get/').then(res=>{
                console.log('recieved data successfully');
                console.log(res);
                setAllData(res?.data);
            }).catch(err=>{
                console.log(err)                
            })
        }catch(err){
            console.log(err);
           
        }
    },[]);
    const handleViewReport = (txt, record)=>{
        console.log('button Clicked');
        console.log(record);
        navigate(`/tshirtReport/${record.project_name}/${record.total_efforts}`);
    }
 
 
    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            align: 'center',
            render: (text, record) => (
                <Link to={`/tshirt/${record.project_name}`}  style={{width:'10px'}}> {/* Corrected path */}
                    {text} {/* Display the text (project name) */}
                </Link>
            ),
        },
        {
            title: 'No Of Objects',
            dataIndex: 'objects_count',
            key: 'objects_count',
            align: 'center'
        },
        {
            title: 'Total efforts(In Days)',
            dataIndex: 'total_efforts',
            key: 'total_efforts',
            align: 'center'
        },
        {
            title: 'Project Timeline',
            dataIndex: 'project_name',
            key: 'project_name',
            align: 'center',
            render: (text, record) => ( // Access record to pass data to the function
                <Button type="primary" onClick={() => handleViewReport(text, record)}>
                    View
                </Button>
            ),
        },
        {
            title: 'Export Effort',
            dataIndex: 'project_name',
            key: 'project_name',
            align: 'center',
            render: (text, record) => ( // Access record to pass data to the function
                <Button type="primary" onClick={() => handleExcel(text, record)}>
                    Export
                </Button>
            ),
        }
    ];
    const handelCreateProject = ()=>{
        setDisplayDiv(true);
    }
    const handleCancelClick = ()=>{
        setDisplayDiv(false);
    };
    const handleCreate = async()=>{
        let projectName = formValues.textField;
 
         // Frontend Validations
        if (!projectName.trim()) {  // Check for empty or whitespace-only string
            // alert("");
            message.warning('Project name cannot be empty or contain only whitespace', 1.3);
            return; // Stop further execution
        }
        if (projectName.startsWith("_") || projectName.endsWith("_")) {
            message.warning('Underscore cannot be at the beginning or end of the project name', 1.3);
            return;
        }
 
        const specialChars = /[!@#$%^&*()+\-=[\]{};':",\\|,.<>\/?]+/; // Regex for special characters
        if (specialChars.test(projectName)) {
            message.warning('Project name cannot contain special characters', 1.3);
            return;
        }
       
        if (/\s/.test(projectName)) { // Check for any whitespace character
            message.warning('Project name cannot contain spaces', 1.3);
            return;
        }
       
        // Additional validations (e.g., minimum/maximum length)
        if (projectName.length < 3) {
            message.warning('Project name must be at least 3 characters long', 1.3);
            return;
        }
       
        if (projectName.length > 50) { // Example max length
            message.warning('Project name cannot exceed 50 characters', 1.3);
            return;
        }
       
        if (/^\d/.test(projectName)) { // Check if the string starts with a digit
            message.warning('Project name cannot start with a number', 1.3);
            return;
        }
 
 
        let temp = {
            "project_name" : projectName
        }
        try{
            const saveResponse = await axios.post(`http://127.0.0.1:8000/project_create/`,temp);
            console.log('Project created successfully');
            console.log(saveResponse.data);
            const getProject = await axios.get(`http://127.0.0.1:8000/project_get/`);
            console.log('Projects Refreshed successfully');
            setAllData(getProject?.data);
            navigate(`/tshirt/${projectName}`);
            setDisplayDiv(false);
        }
        catch(err){
           
            console.log("At Error");
            setDisplayDiv(false);  
            message.error("project already exists", 1);
            // setErrorAlert("Project already exists");
            // // Default error message
            console.log(err);
        }
 
       
       
       
    }
 
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setSearchData([]);
    };
 
    const handleSearch = (e)=>{
        console.log('handel search');
        let temp = []
        if(allData.length>0)
        {
            temp = allData.filter((obj)=>{
                return obj.project_name.toLowerCase().includes(searchText.toLowerCase())
            })
            console.log(searchText);
            console.log(temp);
            setSearchData(temp);
        }
    }
 
 
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, textField: event.target.value });
  };
 
 
 
  const handleExcel = async (text,record) => {
    try {
 
 
            const downloadResponse = await axios.get(`http://127.0.0.1:8000/home_to_excel/${record.project_name}/`,
            {
                responseType: 'blob', // C rucial: Get response as a blob
            });
 
            console.log('Excel downloaded Successfully');
            console.log(downloadResponse);
 
            const blob = new Blob([downloadResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${record.project_name}__Efforts.xlsx`; // Set the filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Release the blob URL (important!)
 
    } catch (error) {
        console.error("Error:", error);
 
       
 
        if (error.response) {
            // console.error("Response data:", error.response.data);
            // console.error("Response status:", error.response.status);
            // console.error("Response headers:", error.response.headers);
            if (error.response.status === 400) {
                // console.error("400 Error: Bad Request");
                // You can also display a user-friendly error message here
                message.warning('The Project has no efforts first save your effort and then download your effort', 1.3);
            }
        } else if (error.request) {
            console.error("Request:", error.request);
        } else {
            console.error("Message:", error.message);
        }
    }
};
 
    return (
 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'inline'}}>
                <div style={{ position: 'absolute', left: '25px',alignContent:'center', marginTop:'6px'  }}>                
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s"
                    style={{width: '100px', height: '50px', marginRight:'10px',cursor: 'pointer' }}
                   
                    onClick={()=>{
                        <Link to="/home"></Link>
                    }}
                    ></img>
                </div>
 
                <h1>Data Migration - Effort and Estimation Report</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <Button
              style={{
                backgroundColor: 'blue',
                color: 'white',
                marginRight: '300px',
                marginLeft: '550px',
 
                // Remove marginBottom: '20px'
                height: '36px', // Match input height
              }}
              onClick={handelCreateProject}
            >
              Create Project
            </Button>
            <div style={{display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '25px', marginBottom: '10px', overflow: 'hidden'}}>
            <Input
              type="text"
              placeholder="Search Objects"
              value={searchText}
              onChange={handleSearchChange}
              onPressEnter={handleSearch}
            style={{
                border: 'none',
                padding: '8px 12px',
                flexGrow: 1,
                borderRadius: 0,
                boxShadow: 'none',
                outline: 'none',
            }}
            />
         
            <button
              onClick={handleSearch}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 0,
                outline: 'none', // Optional: Remove focus outline
            }}
            >
               
              <SearchOutlined style={{ fontSize: '18px' }} />
            </button></div>
          </div>
            {errorAlert && (
                <Alert
                    message={errorAlert}
                    type="error"
                    closable ={false}// Allow the user to close the alert
                    style={{ marginBottom: '10px' }}
                />
            )}
             {/* <div style={{ width: '100%' }} className='hometable'>
                 {searchData.length > 0 && <Table columns={columns} dataSource={searchData} />}
                {searchData.length === 0 && <Table columns={columns} dataSource={allData} />}
             </div>  */}
                <div style={{ width: '100%' }}>
                {searchData.length > 0 && <Table columns={columns} dataSource={searchData}
                 className={styles.customTable} scroll={{
        x: 'max-content',
        y: 55 * 5,
      }} />}
                {searchData.length === 0 && <Table columns={columns} dataSource={allData} className={styles.customTable} scroll={{
        x: 'max-content',
        y: 55 * 5,
      }}/>}
            </div>
             
            {displayDiv && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                            width: '400px',
                        }}
                    >
                        <Form>
                            <Form.Item
                                label="Project Name"
                                name="textField"
                                rules={[{ required: true, message: 'Please input text!' }]}
                            >
                                <Input
                                    value={formValues.textField}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
 
                            <Form.Item style={{ marginBottom: 0 }}> {/* Remove default margin */}
                                <Space>
                                    <Button onClick={handleCancelClick}>Close</Button>
                                    <Button type="primary" onClick={handleCreate} loading={loading}>
                                        Create
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
           
        </div>
 
    );
};
 
export default TshirtHome;
 