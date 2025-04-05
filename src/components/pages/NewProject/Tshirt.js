import React, { useEffect, useState, useRef } from 'react';
import { Input, Table, Select, Button, message, Checkbox, Modal} from "antd";
import axios, { all } from 'axios';
import { useParams } from 'react-router-dom';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AiFillDownSquare } from 'react-icons/ai';
import debounce from 'lodash/debounce';
import { constant } from 'lodash';
import { IoAddCircleSharp } from "react-icons/io5";
import { LuSaveAll } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
import {EditableField} from './EditableCell';
import { Tooltip } from 'antd';
import { EditableSelect } from './EditableCell';
 
 
const { Option } = Select;
 
const Tshirt = () => {
    const navigate = useNavigate();
    const [masterData, setMasterData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [tempmasterData, setTempMasterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState();
    const [inscopeData, setInscopeData] = useState([]);
    const [inscopeBool, setInscopeBool] = useState(false);
 
    const [outscopeData, setOutscopeData] = useState([]);
    const [outscopeBool, setOutscopeBool] = useState(false);
 
    const { projectName } = useParams();
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [uniqId, setUniqId] = useState(1000000000000);
    const [allChecked, setAllChecked] = useState(false);
    const tableRef = useRef(null);
    useEffect(() => {
        setSelectedProject(projectName);
        try{
            setMasterData([]);
            setAllData([]);
            axios.get('http://127.0.0.1:8000/project_get/').then(res=>{
                console.log('response recieved successfully');
                console.log(res);
                setProjects(res.data);          
            }).catch(err=>{
                console.log(err);                
            })
        }catch(err){
            console.log(err);
        };
        handleProjectChange(projectName);
    }, []);    
    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight; // Instant scroll
            //OR
            // tableRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
        }
    }, [masterData, searchData, inscopeData, outscopeData]); // Correct dependency array
 
   
    const handelInscopeData = () => {
        if (inscopeBool) {
            setInscopeBool(false);
            setOutscopeBool(false);
            setAllData(masterData); // Directly set masterData
        } else {
            setOutscopeBool(false);
            const temp = masterData.filter((obj) => obj.scope && obj.scope.toLowerCase() === 'inscope');
            console.log(temp);
           
            setAllData(temp);
            setInscopeBool(true);
            setOutscopeBool(false);
        }
    };
   
    const handelOutscopeData = () => {
        if (outscopeBool) {
            setOutscopeBool(false);
            setInscopeBool(false);
            setAllData(masterData); // Directly set masterData
           
        } else {
            setInscopeBool(false);
            const temp = masterData.filter((obj) => obj.scope && obj.scope.toLowerCase() === 'outscope');
            console.log(temp);
            setAllData(temp);
            setOutscopeBool(true);
            setInscopeBool(false);
        }
    };
    const handleCheckboxChange = (record, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, record]);
        } else {
            setSelectedRows(selectedRows.filter(row => row.id !== record.id));
        }
        console.log(selectedRows);
    }
 
    const handleHeaderCheckboxChange = (e) => {
        setAllChecked(e.target.checked);
        if (e.target.checked) {
          setSelectedRows(allData);
        } else {
          setSelectedRows([]);
        }
      };
   // NO CHANGE
   const columns = [
    {
        title: (
          <Checkbox
            onChange={handleHeaderCheckboxChange}
            checked={allChecked}
          />
        ),
        dataIndex: 'checkbox',
        key: 'checkbox',
        width: '30px',
        render: (text, record) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Checkbox
              style={{ width: '10px', height: '10px' }}
              onChange={(e) => handleCheckboxChange(record, e.target.checked)}
              checked={selectedRows.some((row) => row.id === record.id)}
            />
          </div>
        ),
      },
    {
        title: 'Objects',
        dataIndex: 'object',
        key: 'object',
        align: 'center',
        width: '235px',
        render: (_,record,index) => (  
            <EditableField  
                value={record?.object}  
                onUpdate={(newValue) => handleInputChange(record?.id, 'object', newValue)}
                // disabled={editable}
            />  
        )  
    },
    {
        title: 'module',
        dataIndex: 'module',
        key: 'module',
        align: 'center',
        width : '80px',
        render: (_,record,index) => (  
            <EditableField  
                value={record?.module}  
                onUpdate={(newValue) => handleInputChange(record?.id, 'module', newValue)}
                // disabled={editable}
            />  
        )  
    },
    {
        title: 'Data Object Type',
        dataIndex: 'data_object_type',
        key: 'data_object_type',
        align: 'center',
        width: '170px',
        render: (_, record) => (
          <EditableSelect
            value={record.data_object_type}
            onUpdate={(newValue) => handleSelectChange(record?.id, 'data_object_type', newValue)}
            options={['Master Data', 'Transactional data']}
          />
        ),
      },
      {
        title: 'Transformation Complexity',
        dataIndex: 'transformation_complexity',
        key: 'transformation_complexity',
        align: 'center',
        width: '170px',
        render: (_, record) => (
          <EditableSelect
            value={record.transformation_complexity}
            onUpdate={(newValue) => handleSelectChange(record?.id, 'transformation_complexity', newValue)}
            options={['Medium', 'Low', 'Complex']}
          />
        ),
      },
      {
        title: 'Load Complexity',
        dataIndex: 'load_complexity',
        key: 'load_complexity',
        align: 'center',
        width: '170px',
        render: (_, record) => (
          <EditableSelect
            value={record.load_complexity}
            onUpdate={(newValue) => handleSelectChange(record?.id, 'load_complexity', newValue)}
            options={['0-10000', '10001-50000', '50000-100000', '>100000']}
          />
        ),
      },
      {
        title: 'Source Complexity',
        dataIndex: 'source_complexity',
        key: 'source_complexity',
        align: 'center',
        width: '170px',
        render: (_, record) => (
          <EditableSelect
            value={record.source_complexity}
            onUpdate={(newValue) => handleSelectChange(record?.id, 'source_complexity', newValue)}
            options={['Low', 'Medium', 'Complex']}
          />
        ),
      },
      {
        title: (
          <>
            <Button
              style={{ marginRight: '8px', padding: 0, textDecoration: 'none', border: 'none', color: '#00ffcc', backgroundColor: 'transparent' }}
              onClick={handelInscopeData}
            >
              Inscope
            </Button>
            <Button
              style={{ marginRight: '8px', padding: 0, textDecoration: 'none', border: 'none', color: '#00ffcc', backgroundColor: 'transparent' }}
              onClick={handelOutscopeData}
            >
              OutScope
            </Button>
          </>
        ),
        dataIndex: 'scope',
        key: 'scope',
        align: 'center',
        width: '170px',
        render: (_, record) => (
          <EditableSelect
            value={record.scope}
            onUpdate={(newValue) => handleSelectChange(record?.id, 'scope', newValue)}
            options={['InScope', 'OutScope']}
          />
        ),
      },
    {
        title: 'Iteration 1 - Data Loading',
        dataIndex: 'iteration_1_data_loading',
        key: 'iteration_1_data_loading',
        align: 'center',
        width : '170px',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_1_defects',
        key: 'iteration_1_defects',
        align: 'center',
        width : '220px',
    },
    {
        title: 'Iteration 2 (Data loading to System 2)',
        dataIndex: 'iteration_2_data_loading',
        key: 'iteration_2_data_loading',
        align: 'center',
        width : '170px',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_2_defects',
        key: 'iteration_2_defects',
        align: 'center',
        width : '220px',
    },
    {  
        title: 'Iteration 3 (Data loading to System 3)',
        dataIndex: 'iteration_3_data_loading',
        key: 'iteration_3_data_loading',
        align: 'center',
        width : '170px',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_3_defects',
        key: 'iteration_3_defects',
        align: 'center',
        width : '220px',
    },
    {
        title: 'PRD Data Loads',
        dataIndex: 'production_data_loads',
        key: 'production_data_loads',
        align: 'center',
        width : '130px',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'center',
        width : '170px',
    },
];
    // NO CHANGE
    const handelSaveTable = ()=>{
        // saving project int db
        console.log(selectedProject);
       
        for (let s of masterData) {
            if(s.object.trim().length>0)
            {}
            else
            {
                message.warning('Cannot save Empty Objects', 2);
                return;
            }
        }
       
        console.log(masterData);
        try{
          axios.post(`http://127.0.0.1:8000/project_data_save/${selectedProject}`,masterData).then((res)=>{
            console.log('saved successfull');
            console.log(res);          
          }).catch(err=>{
            console.log(err);          
          })
        }catch(err){
            console.log(err);
        }
        message.success('Saved successfully!', 1);
 
        setTimeout(() => {
            navigate(`/`);
        }, 1500);
       
    };
     // NO CHANGE
    const handleExcel = async () => {
        try {
   
            const downloadResponse = await axios.post(`http://127.0.0.1:8000/sqllite3_to_excel/`,
                allData,
            {
                responseType: 'blob', // C rucial: Get response as a blob
            });
           
            const blob = new Blob([downloadResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
 
            a.download = `${selectedProject}__Effort&Estimate.xlsx`; // Set the filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Release the blob URL (important!)
   
        } catch (error) {
            console.error("Error:", error);
   
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request:", error.request);
            } else {
                console.error("Message:", error.message);
            }
        }
    };
 
 
    const handleInputChange = (id, field, value) => {
        setAllData(prevAllData => {
            return prevAllData.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            });
        });
   
        setMasterData(prevMasterData => {
            return prevMasterData.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            });
        });
    };
    const handleSelectChange = async (id, field, value) => {
        console.log("handleSelectChange called with id:", id, "field:", field, "value:", value);
   
        setLoading(true);
   
        const updatedRow = allData.find(item => item.id === id);
   
        if (!updatedRow) {
            console.error("Row with id", id, "not found");
            setLoading(false);
            return;
        }
   
        const updatedRowWithField = { ...updatedRow, [field]: value };
        console.log("updatedRowWithField:");
        console.log(updatedRowWithField); // Debugging
   
        const requiredFieldsFilled = checkRequiredFields(updatedRowWithField);
        console.log("requiredFieldsFilled:", requiredFieldsFilled); // Debugging
   
        if (requiredFieldsFilled) {
            try {
                const { transformation_complexity, load_complexity, source_complexity, data_object_type, scope } = updatedRowWithField;
 
                if (scope && scope.toLowerCase() === "inscope") {
                    console.log("Calling API for inscope with:", updatedRowWithField);
   
                    const response = await axios.get(
                        `http://127.0.0.1:8000/estimated_time/${transformation_complexity}/${load_complexity}/${source_complexity}/`,
                        { params: updatedRowWithField }
                    );
   
                    console.log("API response:", response.data); // Debugging
   
                    const finalData = {
                        ...updatedRowWithField,
                        ...(() => {
                          const { id, ...rest } = response.data[0]; // Destructure to exclude 'id'
                          return rest;
                        })(),
                        scope,
                      };
                    console.log(" final data");
                    console.log(finalData);
                       
                    setAllData(prevAllData => prevAllData.map(item => item.id === id ? finalData : item));
                    setMasterData(prevMasterData => prevMasterData.map(item => item.id === id ? finalData : item));
                } else {
                    console.log("Setting outscope data for id:", id);
   
                    const finalData = {
                        ...updatedRow,
                        object_development: null,
                        iteration_1_data_loading: null,
                        iteration_1_defects: null,
                        iteration_2_data_loading: null,
                        iteration_2_defects: null,
                        iteration_3_data_loading: null,
                        iteration_3_defects: null,
                        production_data_loads: null,
                        total: 0,
                        scope,
                    };
   
                    setAllData(prevAllData => prevAllData.map(item => item.id === id ? finalData : item));
                    setMasterData(prevMasterData => prevMasterData.map(item => item.id === id ? finalData : item));
                }
                setAllData(prevAllData => prevAllData.map(item => item.id === id ? { ...item, scope } : item));
                setMasterData(prevMasterData => prevMasterData.map(item => item.id === id ? { ...item, scope } : item));
            } catch (error) {
                console.error("Error updating data:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log(updatedRowWithField);
                       
            setAllData(prevAllData => prevAllData.map(item => item.id === id ? updatedRowWithField : item));
            setMasterData(prevMasterData => prevMasterData.map(item => item.id === id ? updatedRowWithField : item));
            // setAllData(prevAllData => updateDataById(prevAllData, id, updatedRowWithField));
            setLoading(false);          
           
        }
    };
 
 
    const checkRequiredFields = (row) => {
        const requiredFields = ['transformation_complexity', 'load_complexity', 'source_complexity', 'scope'];
        for (const field of requiredFields) {
            if (!row[field]) {
                return false;
            }
        }
        return true;
    };
    // let uniqId = 10000000000000000;
    const addRow = () => {
        // alert('hi');
        setTempMasterData(masterData)
        setTimeout(() => {
            console.log(masterData);
        }, 0);        
       
 
        let updatedData = [{
            "id": uniqId,
            "object": "",
            "module": "",
            "data_object_type": '',
            "transformation_complexity": null,
            "load_complexity": null,
            "source_complexity": null,
            "scope": null,
            "object_development": '',
            "iteration_1_data_loading": '',
            "iteration_1_defects": '',
            "iteration_2_data_loading": '',
            "iteration_2_defects": '',
            "iteration_3_data_loading": '',
            "iteration_3_defects": '',
            "production_data_loads": '',
            "total": 0
        } ,...masterData]
        console.log(updatedData)
        setMasterData([]);
        setAllData([]);
        setMasterData(updatedData);
        setAllData(updatedData);
        setUniqId(uniqId+1);
        message.success("added row successfully", 1);
    };
   
    const handleProjectChange = (value) => {
        console.log("changed here ");
        setSelectedProject(value);
        console.log(value);
        // alert();
        setMasterData([]);
        setAllData([]);
        // getting prject specific data
        try {
            // fetching project specific data
            axios.get(`http://127.0.0.1:8000/project_data_get/${value}`)
                .then((res) => {
                setMasterData([]);
                setAllData([]);
                // setInscopeData([]);
                let temp = res.data;
                console.log(temp);
               
                let finalTemp = [];
                temp.forEach(element => {
                    if(element?.scope.toLowerCase() === 'inscope'){
                        finalTemp.push(element);
                    }else{
                        let carry = {
                            "id": element?.id,
                            "object": element?.object,
                            "module": element?.module,
                            "data_object_type": element?.data_object_type,
                            "transformation_complexity": element?.transformation_complexity,
                            "load_complexity": element?.load_complexity,
                            "source_complexity": element?.source_complexity,
                            "scope": element?.scope,
                            "object_development": null,
                            "iteration_1_data_loading": null,
                            "iteration_1_defects": null,
                            "iteration_2_data_loading": null,
                            "iteration_2_defects": null,
                            "iteration_3_data_loading": null,
                            "iteration_3_defects": null,
                            "production_data_loads": null,
                            "total": 0
                        };
                        finalTemp.push(carry);
                    }
                });
                console.log(finalTemp);
                setMasterData(finalTemp);
                setAllData(finalTemp);
                // console.log(res);
                })
                .catch((err) => {
                    // fetching initial data
                console.error('Error fetching data:', err);    //delete error}
                setMasterData([]);
               
                axios.get(`http://127.0.0.1:8000/load_data/`).then((res) => {
                    setMasterData([]);
                    setMasterData(res.data);
                    setAllData(res.data);
                    console.log(res);
                    }).catch(err=>{
                        console.log(err);
                       
                    })
                });
            } catch (err) {
                console.error('Error in useEffect:', err);
            }  
       
    };
    const handleSearchChange = (e) => {
        console.log("changed here 930");
        const newValue = e.target.value;
        setSearchText(newValue);
        console.log(newValue, " 962");
   
        let filteredData = masterData; // Start with the full masterData
   
        if (inscopeBool) {
            filteredData = filteredData.filter(ele => ele?.scope.toLowerCase() === 'inscope');
        } else if (outscopeBool) {
            filteredData = filteredData.filter(ele => ele?.scope.toLowerCase() === 'outscope');
        }
   
        if (newValue) {
            filteredData = filteredData.filter(obj =>
                obj.object.toLowerCase().includes(newValue.toLowerCase())
            );
        }
   
        setAllData(filteredData);
       
    };
   
    const handleSearch = () => {
   
        let filteredData = masterData;
   
        if (inscopeBool) {
            filteredData = filteredData.filter(ele => ele?.scope.toLowerCase() === 'inscope');
        } else if (outscopeBool) {
            filteredData = filteredData.filter(ele => ele?.scope.toLowerCase() === 'outscope');
        }
   
        if (searchText) {
            filteredData = filteredData.filter(obj =>
                obj.object.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        console.log(filteredData);
        setAllData(filteredData);
    };
    const homeClick=()=>{
        navigate(`/`);
    };
 
    const handleDeleteRows = () => {
        setAllData(prevAllData =>
            prevAllData.filter(ele => !selectedRows.some(row => row.id === ele.id))
        );
        setMasterData(prevMasterData =>
            prevMasterData.filter(ele => !selectedRows.some(row => row.id === ele.id))
        );
       
        let objects = [];
        for (let s of selectedRows) {
        objects.push(s.object); // Access the 'object' property of each element 's'
        }
        console.log(objects);
       
 
 
        try{
            axios.put(`http://127.0.0.1:8000/project_data_delete/${selectedProject}`,objects).then((res)=>{
              console.log('deleted successfull');
              message.success("deleted successfully", 1);
 
              console.log(res);          
            }).catch(err=>{
              console.log(err);          
            })
          }catch(err){
              console.log(err);
          }
 
 
 
        setSelectedRows([]);
 
        setPopUp(false); // Clear selected rows after deletion
    };
 
 
    const handleConfirmationYes = ()=>{
        handleDeleteRows();
        setAllChecked(false); // Reset the header checkbox
        setSelectedRows([]);      
    }
    const handleConfirmationNo = ()=>{
        setPopUp(false);
        setSelectedRows([]);
    }
    const buttonData = [
        {
          icon: <IoIosHome />,
          onClick: homeClick,
          tooltip: 'Home',
        },
        {
          icon: <IoAddCircleSharp />,
          onClick: addRow,
          tooltip: 'Add Row',
        },
        {
          icon: <LuSaveAll />,
          onClick: handelSaveTable,
          tooltip: 'Save Table',
        },
        {
          icon: <FaDownload />,
          onClick: handleExcel,
          tooltip: 'Download Excel',
        },
        {
          icon: <MdDelete />,
          onClick: () => {
            if(selectedRows.length === 0){
                message.warning("No objects selected", 1);
                setPopUp(false);
                return;
            }
            setPopUp(true);
        },
          tooltip: 'Delete',
        },
      ];
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ marginBottom: '20px', display: 'inline',textAlign:'center'}}>
                <div style={{ position: 'absolute', left: '25px',alignContent:'center', marginTop:'6px'  }}>                
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s"
                    style={{width: '100px', height: '50px', marginRight:'10px',cursor: 'pointer' }}
                    onClick={()=>{
                        navigate(`/`);
                    }}
                    ></img>
                </div>
 
                <h1>Data Migration - Effort and Estimation Report</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Select on the left */}
               
                <div style={{display: 'flex'}}><label style={{ fontWeight: "bold" }}>ProjectName : </label>
                    <Select
                        style={{ width: 200, marginBottom: '10px' }}
                        placeholder="Select Project"
                        onChange={handleProjectChange}
                        value={selectedProject}
                    >
                        {projects && projects.length > 0 ? (
                        projects.map((element) => (
                            <Option key={element.project_name} value={element.project_name}>
                            {element.project_name}
                            </Option>
                        ))
                        ) : (
                        <Option value={null}>No projects available</Option>
                        )}
                    </Select>
                </div>
 
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px' }}>
        {buttonData.map((button, index) => (
          <div
            key={index}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Button
              style={{
                color: 'white',
                backgroundColor: 'blue',
                marginRight: '10px',
                cursor: 'pointer',
              }}
              onClick={button.onClick}
            >
                <Tooltip title={button.tooltip}>
    {/* <span>Tooltip will show on mouse enter.</span> */}
              {button.icon}
                </Tooltip>
            </Button>
          </div>
        ))}
 
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '25px',
          overflow: 'hidden',
        }}
      >
        <Input
          type="text"
          placeholder="Search Objects"
          value={searchText}
          onChange={handleSearchChange}
          onPressEnter={handleSearch}
          style={{
            border: 'none',
            padding: '8px 5px',
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
            outline: 'none',
          }}
        >
          <SearchOutlined style={{ fontSize: '18px' }} />
        </button>
      </div>
    </div>
</div>
            <div style={{maxHeight: '490px' }} className= 'tableDiv'ref={tableRef}>      
            <Table
                className="review-form"
                columns={columns}
                dataSource={allData.map(item => ({ ...item, key: item.id }))} // Assuming 'id' is a unique identifier
                // used array.map method here to render te page onlyafter the allData is changed
                // if not used we can do with time outs but its not recommended
                // if not used either we wiil get garbage values.......
                pagination={false}
                loading={loading}
                style={{ tableLayout: 'fixed', height: "100%", width: "700px", overflowX: "scroll" }}
                scroll={{ y: `calc(100vh - 250px)` }}
            />
            </div>
            {popUp && (
    <Modal
        title="Confirmation"
        open={popUp}
        onCancel={handleConfirmationNo}
        footer={[
            <Button key="no" onClick={handleConfirmationNo} danger>
                No
            </Button>,
            <Button key="yes" type="primary" onClick={handleConfirmationYes}>
                Yes
            </Button>,
        ]}
    >
        <p>Do you really want to delete these rows?</p>
    </Modal>
)}
        </div>
    );
};
 
export default Tshirt;
 
 
 