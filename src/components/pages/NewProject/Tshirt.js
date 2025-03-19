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
import { FaFileExport } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
 
 
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
                // console.log(projects);
               
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
            setAllData(temp);
            setInscopeBool(true);
        }
    };
   
    const handelOutscopeData = () => {
        if (outscopeBool) {
            setAllData(masterData); // Directly set masterData
            setOutscopeBool(false);
            setInscopeBool(false);
        } else {
            setInscopeBool(false);
            const temp = masterData.filter((obj) => obj.scope && obj.scope.toLowerCase() === 'outscope');
            setAllData(temp);
            setOutscopeBool(true);
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
 
   // NO CHANGE
   const columns = [
    {
        title: '',
        dataIndex: 'checkbox',
        key: 'checkbox',
        width: '30px', // Adjust width as needed
        render: (text, record) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Checkbox
                    style={{ width: '10px', height: '10px' }}
                    onChange={(e) => handleCheckboxChange(record, e.target.checked)}
                    checked={selectedRows.some(row => row.id === record.id)}
                />
            </div>
        ),
    },
    {
        title: 'Objects',
        dataIndex: 'object',
        key: 'object',
        align: 'center',
        // width: '120px',
        render: (text, record, index) => (
            <Input
                // style={{ width: "100%" }}
                value={record.object || ''} // Use record.object instead of defaultValue
                onChange={(e) => handleInputChange(index, 'object', e.target.value)}
            />
        ),
    },
    {
        title: 'module',
        dataIndex: 'module',
        key: 'module',
        align: 'center',
        render: (text, record, index) => (
            <Input
                value={record.module || ''} // Use record.module instead of defaultValue
                onChange={(e) => handleInputChange(index, 'module', e.target.value)}
            />
        ),
    },
    {
        title: 'Data Object Type',
        dataIndex: 'data_object_type',
        key: 'data_object_type',
        align: 'center',
        render: (text, record, index) => (
            <Select
                value={record.data_object_type} // use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleSelectChange(index, 'data_object_type', value)}
            >
                <Option value="Master Data">Master Data</Option>
                <Option value="Transactional data">Transactional data</Option>
            </Select>
        ),
    },
    {
        title: 'Transformation Complexity',
        dataIndex: 'transformation_complexity',
        key: 'transformation_complexity',
        align: 'center',
        render: (text, record, index) => (
            <Select
                value={record.transformation_complexity} // use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleSelectChange(index, 'transformation_complexity', value)}
            >
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
                <Option value="Complex">Complex</Option>
            </Select>
        ),
    },
    {
        title: 'Load Complexity',
        dataIndex: 'load_complexity',
        key: 'load_complexity',
        align: 'center',
        render: (text, record, index) => (
            <Select
                value={record.load_complexity} // use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleSelectChange(index, 'load_complexity', value)}
            >
                <Option value="0-10000">0 - 10000</Option>
                <Option value="10001-50000">10001 - 50000</Option>
                <Option value="50000-100000">50000 - 100000</Option>
                <Option value=">100000">&gt;100000</Option>
            </Select>
        ),
    },
    {
        title: 'Source Complexity',
        dataIndex: 'source_complexity',
        key: 'source_complexity',
        align: 'center',
        render: (text, record, index) => (
            <Select
                value={record.source_complexity} // use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleSelectChange(index, 'source_complexity', value)}
            >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Complex">Complex</Option>
            </Select>
        ),
    },
    {
        title: (
            <>
                <Button
                    style={{
                        marginRight: '8px',
                        padding: 0,
                        textDecoration: 'none',
                        border: 'none',
                        backgroundColor: 'transparent',
                    }}
                    onClick={handelInscopeData}
                >
                    Inscope
                </Button>
                <Button
                    style={{
                        marginRight: '8px',
                        padding: 0,
                        textDecoration: 'none',
                        border: 'none',
                        backgroundColor: 'transparent',
                    }}
                    onClick={handelOutscopeData}
                >
                    OutScope
                </Button>
            </>
        ),
        dataIndex: 'scope',
        key: 'scope',
        align: 'center',
        render: (text, record, index) => (
            <Select
                value={record.scope} // use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleSelectChange(index, 'scope', value)}
            >
                <Option value="InScope">InScope</Option>
                <Option value="OutScope">OutScope</Option>
            </Select>
        ),
    },
    {
        title: 'Object Development',
        dataIndex: 'object_development',
        key: 'object_development',
        align: 'center',
    },
    {
        title: 'Iteration 1 - Data Loading',
        dataIndex: 'iteration_1_data_loading',
        key: 'iteration_1_data_loading',
        align: 'center',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_1_defects',
        key: 'iteration_1_defects',
        align: 'center',
    },
    {
        title: 'Iteration 2 (Data loading to System 2)',
        dataIndex: 'iteration_2_data_loading',
        key: 'iteration_2_data_loading',
        align: 'center',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_2_defects',
        key: 'iteration_2_defects',
        align: 'center',
    },
    {  
        title: 'Iteration 3 (Data loading to System 3)',
        dataIndex: 'iteration_3_data_loading',
        key: 'iteration_3_data_loading',
        align: 'center',
    },
    {
        title: 'Defects/Changes after loads based on the feedback',
        dataIndex: 'iteration_3_defects',
        key: 'iteration_3_defects',
        align: 'center',
    },
    {
        title: 'PRD Data Loads',
        dataIndex: 'production_data_loads',
        key: 'production_data_loads',
        align: 'center',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'center',
    },
];
    // NO CHANGE
    const handelSaveTable = ()=>{
        // saving project int db
        console.log(selectedProject);
       
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
    const handleInputChange = (index, field, value) => {
        setAllData(prevAllData => {
            const newData = [...prevAllData];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
   
        setMasterData(prevMasterData => {
            const newData = [...prevMasterData];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };
   
    const handleSelectChange = async (index, field, value) => {
        console.log("hello world");
   
        setLoading(true);
   
        const updatedRow = { ...allData[index], [field]: value };
        console.log("updated row");
        console.log(updatedRow);
   
        const requiredFieldsFilled = checkRequiredFields(updatedRow);
   
        if (requiredFieldsFilled) {
            try {
                const { transformation_complexity, load_complexity, source_complexity, data_object_type, scope } = updatedRow;
   
                setAllData(prevAllData => {
                    const newData = [...prevAllData];
                    newData[index] = { ...newData[index], scope };
                    return newData;
                });
   
                setMasterData(prevMasterData => {
                    const newData = [...prevMasterData];
                    newData[index] = { ...newData[index], scope };
                    return newData;
                });
   
                if (scope.toLowerCase() === "inscope") {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/estimated_time/${transformation_complexity}/${load_complexity}/${source_complexity}/`,
                        {params: updatedRow}
                    );
   
                    const finalData = {
                        id: allData[index]?.id,
                        object: allData[index]?.object,
                        module: allData[index]?.module,
                        data_object_type,
                        transformation_complexity: response?.data[0]?.transformation_complexity,
                        load_complexity: response?.data[0]?.load_complexity,
                        source_complexity: response?.data[0]?.source_complexity,
                        scope,
                        object_development: response?.data[0]?.object_development,
                        iteration_1_data_loading: response?.data[0]?.iteration_1_data_loading,
                        iteration_1_defects: response?.data[0]?.iteration_1_defects,
                        iteration_2_data_loading: response?.data[0]?.iteration_2_data_loading,
                        iteration_2_defects: response?.data[0]?.iteration_2_defects,
                        iteration_3_data_loading: response?.data[0]?.iteration_3_data_loading,
                        iteration_3_defects: response?.data[0]?.iteration_3_defects,
                        production_data_loads: response?.data[0]?.production_data_loads,
                        total: response?.data[0]?.total,
                    };
                    console.log(finalData);
   
                    setAllData(prevAllData => {
                        const newData = [...prevAllData];
                        newData[index] = finalData;
                        return newData;
                    });
                    setMasterData(prevMasterData => {
                        const newData = [...prevMasterData];
                        newData[index] = finalData;
                        return newData;
                    });
                } else {
                    const finalData = {
                        id: allData[index]?.id,
                        object: allData[index]?.object,
                        module: allData[index]?.module,
                        data_object_type,
                        transformation_complexity,
                        load_complexity,
                        source_complexity,
                        scope,
                        object_development: null,
                        iteration_1_data_loading: null,
                        iteration_1_defects: null,
                        iteration_2_data_loading: null,
                        iteration_2_defects: null,
                        iteration_3_data_loading: null,
                        iteration_3_defects: null,
                        production_data_loads: null,
                        total: 0,
                    };
                    setAllData(prevAllData => {
                        const newData = [...prevAllData];
                        newData[index] = finalData;
                        return newData;
                    });
                    setMasterData(prevMasterData => {
                        const newData = [...prevMasterData];
                        newData[index] = finalData;
                        return newData;
                    });
                }
            } catch (error) {
                console.error("Error updating data:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setAllData(prevAllData => {
                const newData = [...prevAllData];
                newData[index] = { ...newData[index], [field]: value };
                return newData;
            });
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
 
    const addRow = () => {
        // alert('hi');
        setTempMasterData(masterData)
 
        let updatedData = [{
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
                // setOutscopeData([]);
                // setSearchData([]);
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
        setSelectedRows([]);
        setPopUp(false); // Clear selected rows after deletion
    };
    const handleConfirmationYes = ()=>{
        handleDeleteRows();
       
    }
    const handleConfirmationNo = ()=>{
        setPopUp(false);
        setSelectedRows([]);
    }
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ marginBottom: '20px', display: 'inline',textAlign:'center'}}>
                <div style={{ position: 'absolute', left: '25px',alignContent:'center', marginTop:'6px'  }}>                
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s"
                    style={{width: '100px', height: '50px', marginRight:'10px',cursor: 'pointer' }}
                    onClick={()=>{
                        navigate(`/home`);
                    }}
                    ></img>
                </div>
 
                <h1>Data Migration - Effort and Estimation Report</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
  {/* Select on the left */}
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
 
  {/* Right side container for buttons and search */}
  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px' }}>
      <Button
        style={{ color: 'white', backgroundColor: 'blue', marginRight: '10px' }}
        onClick={homeClick}
      >
        <IoIosHome />
      </Button>
 
      <Button
        style={{ color: 'white', backgroundColor: 'blue', marginRight: '10px' }}
        onClick={addRow}
      >
        <IoAddCircleSharp />
      </Button>
 
      <Button
        style={{ color: 'white', backgroundColor: 'blue', marginRight: '10px', cursor: 'pointer' }}
        onClick={handelSaveTable}
      >
        <LuSaveAll />
      </Button>
 
      <Button
        style={{ color: 'white', backgroundColor: 'blue', marginRight: '10px', cursor: 'pointer' }}
        onClick={handleExcel}
      >
        <FaFileExport />
      </Button>
 
      <Button
        style={{ color: 'white', backgroundColor: 'blue', marginRight: '10px', cursor: 'pointer' }}
        onClick={() => {
          setPopUp(true);
        }}
      >
        <MdDelete />
      </Button>
    </div>
 
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '25px', overflow: 'hidden' }}>
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
 