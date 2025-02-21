import React, { useEffect, useState, useRef } from 'react';
import { Input, Table, Select, Button, message} from "antd";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
const { Option } = Select;

const Tshirt = () => {

    const navigate = useNavigate();
    const [masterData, setMasterData] = useState([]);
    const [tempmasterData, setTempMasterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState();
    const [inscopeData, setInscopeData] = useState([]);
    const [outscopeData, setOutscopeData] = useState([]);
    const { projectName } = useParams();
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const tableRef = useRef(null);
    
    const handelInscopeData = ()=>{
        if(inscopeData.length>0){
            setInscopeData([]);
            return;
        }
        setInscopeData([]);
        setOutscopeData([]);
        console.log(masterData)
        const temp = masterData.filter((obj)=>{
            console.log(obj.scope);            
            return obj.scope && obj.scope.toLowerCase() === 'inscope';
        });
        console.log(temp);
        setInscopeData([]);
        setOutscopeData([]);
        setInscopeData(temp);
    }
    const handelOutscopeData = ()=>{
        if(outscopeData.length>0){
            setOutscopeData([]);
            return;
        }
        setInscopeData([]);
        setOutscopeData([]);
        console.log(masterData)
        const temp = masterData.filter((obj)=>{
            console.log(obj.scope);            
            return obj.scope && obj.scope.toLowerCase() === 'outscope';
        });
        console.log(temp);
        setInscopeData([]);
        setOutscopeData([]);
        setOutscopeData(temp);
    }
    const columns = [
        {
            title: 'Objects',
            dataIndex: 'object',
            key: 'object',
            align: 'center',
            render: (text, record, index) => (
                <Input
                style={{width:"150px"}}
                    defaultValue={text || ''}
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
                    defaultValue={text || ''}
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
                    defaultValue={text}
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
                    defaultValue={text}
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
                    defaultValue={text}
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
                    defaultValue={text}
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
            title: 
                <>
                <Button style={{
                    marginRight: '8px', // Note the camelCase
                    padding: 0,
                    textDecoration: 'none', // Note the camelCase
                    border: 'none',
                    backgroundColor: 'transparent',
                }}
                onClick={handelInscopeData}
                >Inscope</Button>
                <Button 
                style={{
                    marginRight: '8px', // Note the camelCase
                    padding: 0,
                    textDecoration: 'none', // Note the camelCase
                    border: 'none',
                    backgroundColor: 'transparent',
                }}
                onClick={handelOutscopeData}
                >OutScope</Button>
                </>
            ,
            dataIndex: 'scope',
            key: 'scope',
            align: 'center',
            render: (text, record, index) => (
                <Select
                    defaultValue={text}
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
            navigate(`/newProject/home/`);
        }, 1500);
        
      };
    const handleExcel = async () => {
        try {
            // const saveResponse = await axios.post(`http://127.0.0.1:8000/temp_save/`, 
            // inscopeData.length>0?inscopeData:outscopeData.length>0 ? outscopeData:masterData);
            // console.log('Temp saved Successfully');
            // console.log(saveResponse.data);
    
            const downloadResponse = await axios.post(`http://127.0.0.1:8000/sqllite3_to_excel/`, 
                inscopeData.length>0?inscopeData:outscopeData.length>0 ? outscopeData:masterData, 
            {
                responseType: 'blob', // C rucial: Get response as a blob
            });
    
            console.log('Excel downloaded Successfully');
            console.log(downloadResponse);
    
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
        const newData = [...masterData];
        newData[index][field] = value;
        // alert();
        setMasterData(newData);
    };

    const handleScopeChange = (index, scope) => {
        console.log(scope);
        
    };

    const handleSelectChange = async (index, field, value) => {
        setLoading(true);
        const updatedRow = { ...masterData[index], [field]: value };
        const requiredFieldsFilled = checkRequiredFields(updatedRow);

        if (requiredFieldsFilled) {
            try {
                console.log(updatedRow);
                let transComplexcity = updatedRow?.transformation_complexity
                let loadComplexcity = updatedRow?.load_complexity
                let sourceComplexcity = updatedRow?.source_complexity
                let data_object = updatedRow?.data_object_type
                let scope = updatedRow?.scope;
                const updatedMasterData = masterData.map((item, i) => {
                    if (i === index) {
                      return { ...item, scope: scope }; // FSearcha new object with the updated scope
                    } else {
                      return item; // Return the original object if not the one being updated
                    }
                  });
                //   alert();
                setMasterData(updatedMasterData);
                console.log(transComplexcity," ",loadComplexcity, " ", sourceComplexcity)
                console.log('scope', scope);
                if(scope === "InScope"){
                    console.log('true');
                    
                }else{
                    console.log('false');
                    
                }
                console.log(' update row');
                setLoading(false);
                console.log(updatedRow); 
                if(scope === "InScope"){
                    const response = await axios.get(`http://127.0.0.1:8000/estimated_time/${transComplexcity}/${loadComplexcity}/${sourceComplexcity}/`, updatedRow);
                    // const newData = [...masterData];
                    // newData[index] = response.data[0];
                    // console.log(newData);
                    
                    // setMasterData(newData);
                    // console.log(response.data);
                    console.log(masterData[index])
                    let finalData = {
                        "object": masterData[index]?.object,
                        "module": masterData[index]?.module,
                        "data_object_type": data_object,
                        "transformation_complexity": response?.data[0]?.transformation_complexity,
                        "load_complexity": response?.data[0]?.load_complexity,
                        "source_complexity": response?.data[0]?.source_complexity,
                        "scope": scope,
                        "object_development": response?.data[0]?.object_development,
                        "iteration_1_data_loading": response?.data[0]?.iteration_1_data_loading,
                        "iteration_1_defects": response?.data[0]?.iteration_1_defects,
                        "iteration_2_data_loading": response?.data[0]?.iteration_2_data_loading,
                        "iteration_2_defects": response?.data[0]?.iteration_2_defects,
                        "iteration_3_data_loading": response?.data[0]?.iteration_3_data_loading,
                        "iteration_3_defects": response?.data[0]?.iteration_3_defects,
                        "production_data_loads": response?.data[0]?.production_data_loads,
                        "total": response?.data[0]?.total
                    };
                    console.log(' final master data');
                    console.log(finalData);
                    const newData = [...masterData];
                    newData[index] = finalData;
                    console.log(newData);
                    // alert();
                    setMasterData(newData);
                }else{
                    console.log(masterData[index])
                    let finalData = {
                        "object": masterData[index]?.object,
                        "module": masterData[index]?.module,
                        "data_object_type": data_object,
                        "transformation_complexity":transComplexcity,
                        "load_complexity":loadComplexcity, 
                        "source_complexity":sourceComplexcity,
                        "scope": scope,
                        "object_development": null,
                        "iteration_1_data_loading":null ,
                        "iteration_1_defects": null,
                        "iteration_2_data_loading": null,
                        "iteration_2_defects": null,
                        "iteration_3_data_loading":null ,
                        "iteration_3_defects": null,
                        "production_data_loads": null,
                        "total":0        
                      };
                    console.log(' final master data');
                    console.log(finalData);
                    const newData = [...masterData];
                    newData[index] = finalData;
                    console.log(newData);
                    // alert();
                    setMasterData(newData);
                }
            } catch (error) {
                console.error("Error updating data:", error);
                // Handle error
            } finally {
                
            }
                    
        } else {
            const newData = [...masterData];
            newData[index][field] = value;
            // alert();
            setMasterData(newData);
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

    const smoothScroll = () => {
        const smoothScrollTo = document.querySelector('.review-form');
        smoothScrollTo.scrollIntoView({ behavior: 'smooth' });
      };
  

    useEffect(() => {
        // 
        setSelectedProject(projectName);
        try{
            // alert();
            setMasterData([]);
            axios.get('http://127.0.0.1:8000/project_get/').then(res=>{
                console.log('response recieved successfully');
                console.log(res);
                setProjects(res.data);          
                console.log(projects);
                
            }).catch(err=>{
                console.log(err);
                
            })
        }catch(err){
            console.log(err);
            
        };
        handleProjectChange(projectName);

    }, []);
    
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
        setTimeout(() => {
            setMasterData(updatedData);
        }, 100);
        console.log(masterData);
        // smoothScroll()   
        
    };
    
    const handleProjectChange = (value) => {
        setSelectedProject(value);
        console.log(value);
        // alert();
        setMasterData([]);
        // getting prject specific data 
        try {
            // fetching project specific data
            axios.get(`http://127.0.0.1:8000/project_data_get/${value}`)
                .then((res) => {
                setMasterData([]);
                setInscopeData([]);
                setOutscopeData([]);
                setSearchData([]);
                let temp = res.data;
                let finalTemp = [];
                temp.forEach(element => {
                    if(element?.scope.toLowerCase() === 'inscope'){
                        finalTemp.push(element);
                    }else{
                        let carry = {
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
                console.log(res);
                })
                .catch((err) => {
                    // fetching initial data
                console.error('Error fetching data:', err);    //delete error} 
                setMasterData([]);
                
                axios.get(`http://127.0.0.1:8000/load_data/`).then((res) => {
                    setMasterData([]);
                    setMasterData(res.data);
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
        setSearchText(e.target.value);
        setSearchData([]);
    };
    const handleSearch = (e)=>{
        console.log('handel search');
        let temp = []
        if(inscopeData.length>0)
        {
            temp = inscopeData.filter((obj)=>{
                return obj.object.toLowerCase().includes(searchText.toLowerCase())
            })
            console.log(searchText);
            console.log(temp);
        }
        else if(outscopeData.length>0)
        {
            temp = outscopeData.filter((obj)=>{
                return obj.object.toLowerCase().includes(searchText.toLowerCase())
            })
            console.log(searchText);
            console.log(temp);
        }
        else
        {
            temp = masterData.filter((obj)=>{
                return obj.object.toLowerCase().includes(searchText.toLowerCase())
            })
            console.log(searchText);
            console.log(temp);
        }
        setSearchData(temp);
    }



    const homeClick=()=>{
        navigate(`/newProject/home/`);
    }
    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight; // Instant scroll
            //OR
            // tableRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
        }
    }, [masterData, searchData, inscopeData, outscopeData]); // Correct dependency array


    
    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div  style={{ marginBottom: '20px', textAlign: 'center' }}><h1>Data Migration - Effort and Estimation Report</h1></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' , justifyContent : 'space-between'}}> {/* Flexbox for alignment */}
      <Select
        style={{ width: 200, marginRight: '10px', marginBottom: '10px' }} // Add margin for spacing
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

      
 
        <div>
        <HomeOutlined style={{ fontSize: '22px', marginRight: '10px' }} onClick={homeClick}/>
      <Button
        style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px', marginBottom: '10px'  }}
        onClick={addRow}
      >
        Add object
      </Button>

      <Button
        style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px', marginBottom: '10px'  }}
        onClick={handelSaveTable}
      >
        Save Effort
      </Button>

      <Button
        style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px', marginBottom: '10px'  }}
        onClick={handleExcel}
      >
        Export to excel
      </Button>
 
      </div>

      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '25px', marginBottom: '10px', overflow: 'hidden' }}>
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
            outline: 'none', // Optional: Remove focus outline
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
    </button>
</div>

    </div>
            <div style={{maxHeight: '490px' }} className= 'tableDiv'ref={tableRef}>
            
            {console.log(masterData)}
            {searchData.length>0?<Table  className='review-form'  columns={columns} dataSource={searchData} pagination={false} loading={loading} style={{ tableLayout: 'fixed',height: "100%" }}  
scroll={{ y: `calc(100vh - 250px)` }}/>:''}
            {searchData.length===0 && inscopeData.length>0?<Table  className='review-form' columns={columns} dataSource={inscopeData} pagination={false} loading={loading} style={{ tableLayout: 'fixed',height: "100%" }}  
scroll={{ y: `calc(100vh - 250px)` }}/>:''}
            {searchData.length===0 && outscopeData.length>0?<Table  className='review-form' columns={columns} dataSource={outscopeData} pagination={false} loading={loading} style={{ tableLayout: 'fixed',height: "100%" }}  
scroll={{ y: `calc(100vh - 250px)` }}/>:''}
            {searchData.length===0 && inscopeData.length===0 && outscopeData.length===0 ? <Table className='review-form' columns={columns} dataSource={masterData} pagination={false} loading={loading} style={{ tableLayout: 'fixed',height: "100%",width:"700px",overflowX:"scroll" }} 
scroll={{ y: `calc(100vh - 250px)` }} />:'' }

            {/* <Table columns={columns} dataSource={searchData} pagination={false} loading={loading} />     */}
            </div>
        </div>
    );


};

export default Tshirt;