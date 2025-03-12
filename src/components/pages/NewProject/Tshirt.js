import React, { useEffect, useState, useRef } from 'react';
import { Input, Table, Select, Button, message} from "antd";
import axios, { all } from 'axios';
import { useParams } from 'react-router-dom';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AiFillDownSquare } from 'react-icons/ai';
const { Option } = Select;

const Tshirt = () => {
    const navigate = useNavigate();
    const [masterData, setMasterData] = useState([]);
    const [allData, setAllData] = useState();
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
                console.log(projects);
                
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

    const handelInscopeData = ()=>{
        if(inscopeBool){
            setInscopeBool(false);
            setOutscopeBool(false);
            // setAllData(masterData);
            setAllData([]);
            setTimeout(() => {
                setAllData(masterData);
            }, 10);
        }else{
            console.log("Hello in HandlInscope Else");
            setOutscopeBool(false);
            setAllData([]);
            setTimeout(() => {
                console.log(masterData);
                const temp = masterData.filter((obj)=>{
                    console.log(obj.scope);            
                    return obj.scope && obj.scope.toLowerCase() === 'inscope';
                });
                console.log(temp);
                setAllData(temp);
                setInscopeBool(true);
            }, 10);
        }
        
        
    }
    const handelOutscopeData = ()=>{
        if(outscopeBool){
            setAllData([]);
            setOutscopeBool(false);
            setInscopeBool(false);
            setTimeout(() => {
                setAllData(masterData);
            }, 0);
            
            return;
        }
        setInscopeBool(false);
        // setInscopeData([]);
        // setOutscopeData([]);
        setAllData([]);
        setTimeout(() => {
            // console.log(masterData);
            const temp = masterData.filter((obj)=>{
                console.log(obj.scope);            
                return obj.scope && obj.scope.toLowerCase() === 'outscope';
            });
            // console.log(temp);
            setAllData(temp);
            setOutscopeBool(true);
        }, 10);
    }
 
   // NO CHANGE
    const columns = [
        {
            title: 'Objects',
            dataIndex: 'object',
            key: 'object',
            align: 'center',
            render: (text, record, index) => (
                <Input
                style={{width:"auto"}}
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
            // const saveResponse = await axios.post(`http://127.0.0.1:8000/temp_save/`, 
            // inscopeData.length>0?inscopeData:outscopeData.length>0 ? outscopeData:masterData);
            // console.log('Temp saved Successfully');
            // console.log(saveResponse.data);
    
            const downloadResponse = await axios.post(`http://127.0.0.1:8000/sqllite3_to_excel/`, 
                allData, 
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
        setAllData(newData);
    };
    const handleScopeChange = (index, scope) => {
        console.log(scope);
    };
    const handleSelectChange = async (index, field, value) => {
        if(inscopeBool === true){
            // console.log("inscope");
            // console.log(allData);
            // console.log(index, field, value);        
            setLoading(true);
            const updatedRow = { ...allData[index], [field]: value };
            // console.log(updatedRow);
            const requiredFieldsFilled = checkRequiredFields(updatedRow);
            if (requiredFieldsFilled) {
                try {
                    // console.log(updatedRow);
                    let transComplexcity = updatedRow?.transformation_complexity
                    let loadComplexcity = updatedRow?.load_complexity
                    let sourceComplexcity = updatedRow?.source_complexity
                    let data_object = updatedRow?.data_object_type
                    let scope = updatedRow?.scope;
                    const updatedMasterData = allData.map((item, i) => {
                        if (i === index) {
                        return { ...item, scope: scope }; // FSearcha new object with the updated scope
                        } else {
                        return item; // Return the original object if not the one being updated
                        }
                    });
                    // console.log(updatedMasterData);
                    
                    setAllData(updatedMasterData);
                    if(scope.toLowerCase() === "inscope"){
                        // console.log('true');
                    }else{
                        // console.log('false');
                    }
                    // console.log(' update row');
                    setLoading(false);
                    if(scope.toLowerCase() === "inscope"){
                        console.log(allData);
                        
                        const response = await axios.get(`http://127.0.0.1:8000/estimated_time/${transComplexcity}/${loadComplexcity}/${sourceComplexcity}/`, updatedRow);
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // console.log(' final master data');
                        // console.log(finalData);
                        const newData = [...allData];
                        newData[index] = finalData;
                        // console.log(newData);
                        // alert();
                        // setMasterData(newData);
                        // console.log(newData);                        
                        setAllData(newData);
                    }else{
                        console.log(allData);

                        // console.log("out scope line 432");
                        // console.log(allData[index])
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // now remove final data in allData and append this updated data to master data
                        
                        // console.log(finalData);
                        // console.log("bhoooooom");
                        setAllData([]);
                        setTimeout(() => {
                            const newData = allData.filter((obj) => obj.id !== finalData.id);
                            // console.log(newData);
                            setAllData(newData);
                            const updatedMasterData = masterData.map(element => {
                                if (element.id === finalData.id) {
                                    // Create a new object with the updated scope
                                    // return { ...element, scope: finalData.scope }
                                    return finalData;;

                                }
                                return element; // Keep other elements unchanged
                            });
                            
                            setMasterData(updatedMasterData);
                        }, 1);
                        // setTimeout(() => {
                            
                        // }, 10);
                        
                        // now update in master data
                        
                    }
                } catch (error) {
                    console.error("Error updating data:", error);
                    // Handle error
                } finally {
                }    
            } else {
                const newData = [...allData];
                newData[index][field] = value;

                // setMasterData(newData);
                setAllData(newData);
                setLoading(false);
            }
        }else if(outscopeBool=== true){
            setLoading(true);
            const updatedRow = { ...allData[index], [field]: value };
            // console.log(updatedRow);
            const requiredFieldsFilled = checkRequiredFields(updatedRow);
            if (requiredFieldsFilled) {
                try {
                    // console.log(updatedRow);
                    let transComplexcity = updatedRow?.transformation_complexity
                    let loadComplexcity = updatedRow?.load_complexity
                    let sourceComplexcity = updatedRow?.source_complexity
                    let data_object = updatedRow?.data_object_type
                    let scope = updatedRow?.scope;
                    const updatedMasterData = allData.map((item, i) => {
                        if (i === index) {
                        return { ...item, scope: scope }; // FSearcha new object with the updated scope
                        } else {
                        return item; // Return the original object if not the one being updated
                        }
                    });
                    console.log(updatedMasterData);
                    
                    setAllData(updatedMasterData);
                    // ---------------------------------------------------------------------------------------
                    if(scope.toLowerCase() === "inscope"){
                        // console.log('true');
                    }else{
                        // console.log('false');
                    }
                    // console.log(' update row');
                    setLoading(false);
                    if(scope.toLowerCase() === "inscope"){
                        console.log(allData);
                        
                        const response = await axios.get(`http://127.0.0.1:8000/estimated_time/${transComplexcity}/${loadComplexcity}/${sourceComplexcity}/`, updatedRow);
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // console.log(' final master data');
                        console.log(finalData);
                        // const newData = [...allData];
                        // newData[index] = finalData;
                        // console.log(newData);
                        // alert();
                        // setMasterData(newData);
                        // console.log(newData);                        
                        setAllData([]);
                        console.log(
                            "nulled alldata"
                        );
                        
                        setTimeout(() => {
                            const newData = allData.filter((obj) => obj.id !== finalData.id);
                            console.log(newData);
                            setAllData(newData);
                            const updatedMasterData = masterData.map(element => {
                                if (element.id === finalData.id) {
                                    // Create a new object with the updated scope
                                    // return { ...element, scope: finalData.scope }
                                    return finalData;;

                                }
                                return element; // Keep other elements unchanged
                            });
                            
                            setMasterData(updatedMasterData);
                        }, 1);
                    }else{
                        // console.log("out scope line 432");
                        // console.log(allData[index])
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // now remove final data in allData and append this updated data to master data
                        
                        // console.log(finalData);
                        // console.log("bhoooooom");
                        // setAllData([]);
                        // setTimeout(() => {
                        //     const newData = allData.filter((obj) => obj.id !== finalData.id);
                        //     // console.log(newData);
                        //     setAllData(newData);
                        //     const updatedMasterData = masterData.map(element => {
                        //         if (element.id === finalData.id) {
                        //             // Create a new object with the updated scope
                        //             // return { ...element, scope: finalData.scope }
                        //             return finalData;

                        //         }
                        //         return element; // Keep other elements unchanged
                        //     });
                            
                        //     setMasterData(updatedMasterData);
                        // }, 1);
                        // setTimeout(() => {
                            
                        // }, 10);
                        
                        // now update in master data
                        const newData = [...allData];
                        newData[index] = finalData;
                        // console.log(newData);
                        // alert();
                        // setMasterData(newData);
                        // console.log(newData);                        
                        setAllData(newData);
                        const updatedMasterData = masterData.map(element => {
                            if (element.id === finalData.id) {
                                // Create a new object with the updated scope
                                // return { ...element, scope: finalData.scope }
                                return finalData;;

                            }
                            return element; // Keep other elements unchanged
                        });
                        
                        setMasterData(updatedMasterData);
                        
                    }
                } catch (error) {
                    console.error("Error updating data:", error);
                    // Handle error
                } finally {
                }    
            } else {
                const newData = [...allData];
                newData[index][field] = value;

                // setMasterData(newData);
                setAllData(newData);
                setLoading(false);
            }
        }else{

            // console.log(index, field, value);        
            setLoading(true);
            const updatedRow = { ...allData[index], [field]: value };
            const requiredFieldsFilled = checkRequiredFields(updatedRow);
            if (requiredFieldsFilled) {
                try {
                    console.log(updatedRow);
                    let transComplexcity = updatedRow?.transformation_complexity
                    let loadComplexcity = updatedRow?.load_complexity
                    let sourceComplexcity = updatedRow?.source_complexity
                    let data_object = updatedRow?.data_object_type
                    let scope = updatedRow?.scope;
                    const updatedMasterData = allData.map((item, i) => {
                        if (i === index) {
                        return { ...item, scope: scope }; // FSearcha new object with the updated scope
                        } else {
                        return item; // Return the original object if not the one being updated
                        }
                    });
                    // setMasterData(updatedMasterData);
                    setAllData(updatedMasterData);
                    // console.log(transComplexcity," ",loadComplexcity, " ", sourceComplexcity)
                    // console.log('scope', scope);
                    if(scope.toLowerCase() === "inscope"){
                        // console.log('true');
                    }else{
                        // console.log('false');
                    }
                    // console.log(' update row');
                    setLoading(false);
                    // console.log(updatedRow); 
                    if(scope.toLowerCase() === "inscope"){
                        const response = await axios.get(`http://127.0.0.1:8000/estimated_time/${transComplexcity}/${loadComplexcity}/${sourceComplexcity}/`, updatedRow);
                        // console.log(allData[index])
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // console.log(' final master data');
                        // console.log(finalData);
                        const newData = [...allData];
                        newData[index] = finalData;
                        // console.log(newData);
                        // alert();
                        // setMasterData(newData);
                        setAllData(newData);
                        const updatedMasterData = masterData.map(element => {
                            if (element.id === finalData.id) {
                                // Create a new object with the updated scope
                                // return { ...element, scope: finalData.scope }
                                return finalData;;

                            }
                            return element; // Keep other elements unchanged
                        });
                        
                        setMasterData(updatedMasterData);


                    }else{
                        // console.log(allData[index])
                        let finalData = {
                            "id": allData[index]?.id,
                            "object": allData[index]?.object,
                            "module": allData[index]?.module,
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
                        // console.log(' final master data');
                        // console.log(finalData);
                        const newData = [...masterData];
                        newData[index] = finalData;
                        // console.log(newData);
                        // alert();
                        setMasterData(newData);
                        setAllData(newData);

                    }
                } catch (error) {
                    console.error("Error updating data:", error);
                    // Handle error
                } finally {
                }    
            } else {
                const newData = [...masterData];
                newData[index][field] = value;
                setMasterData(newData);
                setAllData(newData);
                setLoading(false);
            }
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
        setTimeout(() => {
            setMasterData(updatedData);
            setAllData(updatedData);
        }, 100);
        console.log(masterData);
        // smoothScroll()   
        
    };
    
    const handleProjectChange = (value) => {
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
                setInscopeData([]);
                setOutscopeData([]);
                setSearchData([]);
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
        setSearchText(e.target.value);
        console.log(e.target.value);
        if(e.target.value === ''){
            if(inscopeBool === true){
                const tempData = masterData.filter(ele=>{
                    return ele?.scope.toLowerCase() === 'inscope'
                })
                console.log(tempData);
                setAllData([]);
                setTimeout(() => {
                    setAllData(tempData);
                }, 0);
            }   
        else if(outscopeBool === true){
                const tempData = masterData.filter(ele=>{
                    return ele?.scope.toLowerCase() === 'outscope'
                })
                console.log(tempData);
                setAllData([]);
                setTimeout(() => {
                    setAllData(tempData);
                }, 0);
        }else{
            setAllData(masterData);
        }
    }
        setSearchData([]);
    };
    const handleSearch = (e)=>{
        console.log('handel search');
        setAllData([]);
        
            setTimeout(() => {
                // if(searchText.length === 0){
                //     setTimeout(() => {
                //         setAllData(masterData);
                //     }, 0);
                // }else{
                    let temp = allData.filter((obj)=>{
                    return obj.object.toLowerCase().includes(searchText.toLowerCase())
                })
                console.log(searchText);
                console.log(temp);
                setAllData(temp);
            // }
                // setLoading(false);
            }, 1);
           
        // }
        // setSearchData(temp);
    }
    const homeClick=()=>{
        navigate(`/`);
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
                <Table 
                    className='review-form' columns={columns} dataSource={allData} pagination={false} loading={loading} 
                    style={{ tableLayout: 'fixed',height: "100%",width:"700px",overflowX:"scroll" }} 
                    scroll={{ y: `calc(100vh - 250px)` }} 
                />
            </div>
        </div>
    );


};

export default Tshirt;