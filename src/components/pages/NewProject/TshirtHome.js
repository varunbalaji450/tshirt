import React from 'react';
import { Button, Table, Form, Input,Space  } from 'antd';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from "antd";

const TshirtHome = () => {
    const navigate = useNavigate();
    const [allData, setAllData] = useState([]);
    const [displayDiv, setDisplayDiv] = useState(false);
    const [formValues, setFormValues] = useState({ textField: '' });
    const [loading,setLoading]=useState(false);
    const [errorAlert, setErrorAlert] = useState(null);
    // const temp = [
    //     {
    //         project_name: 'abcd',
    //         no_of_objects: '1',
    //         total_effects: '1'
    //     },
    //     {
    //         project_name: 'efgh',
    //         no_of_objects: '2',
    //         total_effects: '2'
    //     },
    //     {
    //         project_name: 'ijkl',
    //         no_of_objects: '3',
    //         total_effects: '3'
    //     }
    // ];
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
        navigate(`/newProject/tshirtReport/${record.project_name}/${record.total_efforts}`);
    }

    useEffect(() => {
        if (errorAlert) {
            const timer = setTimeout(() => {
                setErrorAlert(null); // Clear the alert after 2 seconds
            }, 2000);

            return () => clearTimeout(timer); // Clear the timer if the component unmounts or the alert changes
        }
    }, [errorAlert]);
 
    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            align: 'center',
            render: (text, record) => (
                <Link to={`/newProject/tshirt/${record.project_name}`}  style={{width:'10px'}}> {/* Corrected path */}
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
        }
    ];
    const handelCreateProject = ()=>{
        setDisplayDiv(true);
    }
    const handleCancelClick = ()=>{
        setDisplayDiv(false);
    };
    const handleCreate = async()=>{
        console.log('created successfully');
        
        console.log("Project Name:", formValues.textField);
        let projectName = formValues.textField;

         // Frontend Validations
        if (!projectName.trim()) {  // Check for empty or whitespace-only string
            alert("Project name cannot be empty or contain only whitespace.");
            return; // Stop further execution
        }
        if (projectName.startsWith("_") || projectName.endsWith("_")) {
            alert("Underscore cannot be at the beginning or end of the project name.");
            return;
        }

        const specialChars = /[!@#$%^&*()+\-=[\]{};':",\\|,.<>\/?]+/; // Regex for special characters
        if (specialChars.test(projectName)) {
            alert("Project name cannot contain special characters.");
            return;
        }

        if (/\s/.test(projectName)) { // Check for any whitespace character
            alert("Project name cannot contain spaces.");
            return;
        }

        // Additional validations (e.g., minimum/maximum length)
        if (projectName.length < 3) {
            alert("Project name must be at least 3 characters long.");
            return;
        }

        if (projectName.length > 50) { // Example max length
            alert("Project name cannot exceed 50 characters.");
            return;
        }

        if (/^\d/.test(projectName)) { // Check if the string starts with a digit
            alert("Project name cannot start with a number.");
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
            navigate(`/newProject/tshirt/${projectName}`);
            setDisplayDiv(false);
        }
        catch(err){
            
            console.log("At Error");
            setDisplayDiv(false);  
            setErrorAlert("Project already exists"); // Default error message
            console.log(err);
        }

        
        
        
    }

  const handleInputChange = (event) => {
    setFormValues({ ...formValues, textField: event.target.value });
  };
    return (

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>Data Migration - Effort and Estimation Report</h1>
            </div>
            <Button
                style={{ backgroundColor: 'blue', color: 'white', marginBottom: '20px' }}
                onClick={handelCreateProject}
            >
                Create Project
            </Button>
            {errorAlert && (
                <Alert
                    message={errorAlert}
                    type="error"
                    closable ={false}// Allow the user to close the alert
                    style={{ marginBottom: '10px' }}
                />
            )}
            <div style={{ width: '100%' }} className='hometable'> {/* Table takes full width */}
                <Table columns={columns} dataSource={allData} />
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