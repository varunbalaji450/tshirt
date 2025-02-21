import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Select, Checkbox, Divider, Typography, Form, Row, Col, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CgEnter } from 'react-icons/cg';
import axios from 'axios';
import { ExceptionMap } from 'antd/es/result';
import { Message } from "antd";
 
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
 
 
function RulesForm() {
 
  const [selectedRules, setSelectedRules] = useState([]);
  const [rules, setRules] = useState([]);
  const [projects,setprojects] = useState([]);
  const [objects,setObjects] = useState([]);
  const [segments,setsegments] = useState([]);
  const [fields,setfields] = useState([]);
  const [versions,setVersions] = useState([]);
  const [vPress,setvPress] = useState(true);
  const [editable, setEditable] = useState(true);
 
  const [feildFlag,setFeildFlag]=useState(false);
  const [ruleFlag,setRuleFlag]=useState(false);
 
  const [selectedProject, setSelectedProject] = useState(null); // Store selected project
  const [selectedObject,setselectedObject] = useState();
  const [selectedSegment,setselectedSegment] = useState();
  const [selectedVersion,setselectedVersion] = useState();
  // const [enabelPopUp, setEnabelPopUp] = useState(false);
 
  const[dataBaseFlag,setdataBaseFlag] = useState(true);
  const [tick, setTick ] = useState(false);
 
 
 
 
  const fetchProjects = async()=>{
    const response = await axios.get("http://127.0.0.1:8000/api/Pget/");
    console.log(response.data);
    setprojects(response.data);
  }
 
  useEffect(()=>{
    fetchProjects();
  },[])
 
 
 
  const handleCheckboxChange = (index) => {
    console.log("Called tic method")
    setTick(!tick)
    const updatedRules = [...rules];
    updatedRules[index].check_box = !updatedRules[index].check_box;
    setRules(updatedRules);
 
    const updatedSelectedRules = updatedRules.filter((rule) => rule.check_box);
    setSelectedRules(updatedSelectedRules);
  };
 
  const handleInputChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };
 
 
  const handleProjectChange = (value) => {
    console.log("Selected Project:", value);
    setSelectedProject(value);
    setselectedObject();
    setselectedSegment();
    setselectedVersion();
 
 
  };
 
  const fetchObjects = async ()=>{
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/PdataObject/${selectedProject}/`);
      setObjects(response?.data);
      console.log(response?.data);
    }
    catch{
 
    }
  }
 
  useEffect(()=>{
    fetchObjects();
  },[selectedProject])
 
 
  const handleSegmentChange = (value) => {
    console.log("Selected Segment:", value);
    setselectedSegment(value);
    setselectedVersion();
    setEditable(true);
 
  };
  const handleObjectChange = (value) => {
    console.log("Selected Segment:", value);
    setselectedObject(value);
    setselectedSegment();
    setselectedVersion();
  };
  const handleVersionChange = (value)=>{
    console.log("Selected Version:", value);
    if(value==="X"){
      // setEnabelPopUp(false);
      setselectedVersion(value);
      setEditable(false);
      const data = fetchRules(selectedProject,selectedObject,selectedSegment);
      console.log("hiiii",data);
      data.then((data)=>{
        console.log(data);
        setRules(data);
      });
    }
    else{
      // setEnabelPopUp(true);  
      setEditable(true);
      setselectedVersion(0);
      setselectedVersion(value);
    }
  }
  const fetchSegments = async ()=>{
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/Osegements/${selectedProject}/${selectedObject}/`)
      console.log(response?.data);
      setsegments(response?.data);
    }
    catch{
 
    }
   
  }
  useEffect(()=>{
    fetchSegments();
  },[selectedObject])
 
 
  const fetchfields = async()=>{
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/Sfields/${selectedProject}/${selectedObject}/${selectedSegment}/` );
      setfields(response?.data);
      setFeildFlag(!feildFlag);
      console.log(response?.data);
    }
    catch{
 
    }  
  };
  useEffect(()=>{
    fetchfields();
  },[selectedSegment])
 
  function mergeData( fieldData) {
    const mergedData = [];
    fieldData.forEach((field) => {
      console.log("fffffffff",field);
      mergedData.push({
        version_id : 0 ,
        source_table: '',
        source_field_name: '',
        data_mapping_type:'',
        data_mapping_rules: '',
        project_id : selectedProject,
        object_id : selectedObject,
        field_id : field.field_id,
        segment_id : selectedSegment,
        target_sap_table: field.sap_structure,
        target_sap_field: field.fields,
        text_description: field.description,
        lookup_table: "",
        last_updated_by: 'System',
        last_updated_on:'',
        rule_status: '',
        check_box: field.isMandatory,
        isMandatory : field.isMandatory
      });
    });
    return [ ...mergedData];
  }
 
  useEffect(()=>{
    const temp = mergeData(fields);
    console.log(temp);
      setRules(temp);
  },[dataBaseFlag]);
 
  const fetchRules = async (projectId, objectId, segmentId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/GetSaveRules/${projectId}/${objectId}/${segmentId}/`);
      // setdataBaseFlag(!dataBaseFlag);
      console.log("SATUUUUUUUUUUUUUUUUU")
      return response.data;
    } catch (error) {
      console.log('Error fetching rules:', error);
      // const temp = mergeData(fields);
      // setRules(temp);
      setdataBaseFlag(!dataBaseFlag);
    }

  };
  // const fetchVersionRules = async (projectId, objectId, segmentId) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/getSaveRules/`, {
  //       params: {
  //         project_id: projectId,
  //         object_id: objectId,
  //         segment_id: segmentId,
  //       },
  //     });
 
  //     return response.data;
  //   } catch (error) {
  //     console.log('Error fetching rules:', error);
  //     // const temp = mergeData(fields);
  //     // setRules(temp);
  //     setdataBaseFlag(!dataBaseFlag);
  //   }
  // };
 
 
  useEffect(()=>{
    const data = fetchRules(selectedProject,selectedObject,selectedSegment);
    console.log("hiiii",data);
    data.then((data)=>{
      console.log(data);
      setRules(data);
 
    })
  },[selectedSegment])
 
  const createRules = async()=>{
    try{
      const response = await fetch('http://127.0.0.1:8000/api/CreateSaveRules/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rules),
      });
 
      const data = fetchRules(selectedProject,selectedObject,selectedSegment);
      data.then((data)=>{
        console.log(data);
      setRules(data);
      }).catch(()=>{})
    }
    catch{
    }
  }
  const createVersionRules = async()=>{
    try{
      const response = await fetch('http://127.0.0.1:8000/api/VersionRuleCreate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rules),
      });
 
      const data = fetchRules(selectedProject,selectedObject,selectedSegment);
      data.then((data)=>{
        console.log(data);
      setRules(data);
      setvPress(!vPress)
      }).catch(()=>{})
    }
    catch{
    }
  }
 
  useEffect(()=>{
    createRules()
  },[ruleFlag])
 
  const handleSubmit = () => {
    console.log(rules);
    setRuleFlag(!ruleFlag);
  };
 
 
  const versionNumber = async()=>{
    try{
    const response = await axios.get(`http://127.0.0.1:8000/api/RuleVersions/${selectedProject}/${selectedObject}/${selectedSegment}/`);
    console.log("console.og",response?.data)
    setVersions(response?.data);
    if(response.data.length === 0)setEditable(false);
    return response.data;
    }
    catch{
 
    }
  }
  useEffect(()=>{
    versionNumber();
    },[selectedSegment,vPress])
 
    const handleVersion = () =>{
      setRuleFlag(!ruleFlag);
      createRules();
      // setvPress(!vPress);
      createVersionRules();
      // const data=versionNumber();
      // console.log(data)
      // data.then((data)=>setVersions(data)).catch(()=>{})
    }
 
  const getVersionRules = async()=>{
    if(selectedVersion==="X"){
      const data = fetchRules(selectedProject,selectedObject,selectedSegment);
      data.then((data)=>{
        console.log(data);
      setRules(data);
      }).catch(()=>{})
    }
    else{
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/VersionData/${selectedProject}/${selectedObject}/${selectedSegment}/${selectedVersion}/`);
      console.log("console.og",response?.data);
      setRules(response?.data)
      }
      catch{
 
      }
    }
  }  
  useEffect(()=>{
    getVersionRules();
  },[selectedVersion]);
  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    borderRadius: '8px',
    textAlign: 'center',
  };
 
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 999,
  };
 
  const buttonStyle = {
    margin: '0 10px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  };
 
  return (
    <div className="container"    >
        <div className="filters">
            <Form layout="inline" className="filter-form">
                <Form.Item label="Project Name" className="form-item"
                >
                    <Select
                        style={{ width: 200 }}
                        onChange={handleProjectChange}
                        value={selectedProject ? selectedProject.project_id : undefined}
                    >
                        {projects?.map(project => (
                            <Option key={project?.project_id} value={project?.project_id}>
                                {project?.project_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Data Object" className="form-item">
                    <Select
                        style={{ width: 200 }}
                        onChange={handleObjectChange}
                        // value={selectedObject ? selectedObject.obj_id : undefined}
                        value={selectedObject}
                    >
                        {objects?.map(object => (
                            <Option key={object?.obj_id} value={object?.obj_id}>
                                {object?.obj_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Data Segment" className="form-item">
                    <Select
                        style={{ width: 200 }}
                        onChange={handleSegmentChange}
                        // value={selectedSegment ? selectedSegment.segment_id : undefined}
                        value={selectedSegment}
                    >
                        {segments?.map(segment => (
                            <Option key={segment?.segment_id} value={segment?.segment_id}>
                                {segment?.segement_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Select Version" className="form-item">
                <Select
                        style={{ width: 200 }}
                        onChange={handleVersionChange}
                        // value={selectedVersion ? selectedVersion.ind : undefined}
                        value={selectedVersion} >
                        {versions  && versions.map(version => (
                <Option key={version?.ind} value={version?.ind}>
                    {"v"}{version?.ind} 
                </Option>
            ))}
                        <Option key={999} value={'X'}>
                                {'In process Version'}
                            </Option>
                    </Select>
                </Form.Item>
            </Form>
        </div>
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',  //Optional: Adjust padding as needed
        }}
        ><h2 className="rules-header">
          Rules</h2>
        {
          editable===true && <Button
        onClick={()=>{
          // setEnabelPopUp(true);
        }}>Edit</Button>  
        }
       
        </div>
       
        <div className="table-container" style={{ overflowY: 'scroll', maxHeight: '400px'}}>
            <table className="rules-table ">
                <thead>
                    <tr>
                        <th><input type="checkbox" onChange={() => {
                          setTick(!tick)
                        }} /></th>
                        <th>Rule</th>
                        <th>Source Table</th>
                        <th>Source Field Name</th>
                        <th>Data Mapping Type</th> 
                        <th>Data Mapping Rules</th>
                        <th>Target SAP Table</th>
                        <th>Target SAP Field</th>
                        <th>Text Description</th>
                        <th>Look Up Table</th>
                        <th>Last Updated By</th>
                        <th>Last Updated On</th>
                        <th>Rule Status</th>
                    </tr>
                </thead>
                <tbody >
                  {console.log("hiiiieeeiieu",rules)}
                  {tick === true ?
                    (rules?.map((rule, index) => (

                      <tr key={index}>
                      
                      <td><input type="checkbox" checked={rule.check_box}
                      
                      disabled = {editable}
                      
                      onChange={() => handleCheckboxChange(index)} /></td>
                      
                      {/* rules is index here */}
                      
                      <td>{index}</td>
                      
                     {/* <td>{rule.rule_no}</td> */}
                    
                      <td><input type="text" value={rule?.source_table ? rule?.source_table:'' } disabled = {editable}
                      
                      onChange={(e) => handleInputChange(index, 'source_table', e.target.value)} /></td>
                      
                      <td><input type="text" value={rule.source_field_name ? rule?.source_field_name : ''} disabled = {editable} onChange={(e) => handleInputChange(index, 'source_field_name', e.target.value)}
                      
                      /></td>
                      
                      {/*  data Mapping Tyes */}
                      
                      <td>
                      
                      <select
                      
                      disabled = {editable}
                      
                      onChange={(e) => handleInputChange(index, 'data_mapping_type', e.target.value)}
                      
                       >
                      
                       <option value="1:1">1:1</option>
                      
                      <option value="Constant">Constant</option>
                      
                       <option value="LLM">LLM</option>
                       </select>
                      
                      </td>
                      
                      <td><input type="text" value={rule.data_mapping_rules ? rule.data_mapping_rules : ''} disabled = {editable} onChange={(e) => handleInputChange(index, 'data_mapping_rules', e.target.value)}
                      
                      /></td>
                      
                      <td>{rule.target_sap_table}</td>
                      
                      <td>{rule.target_sap_field}</td>
                      
                      <td>{rule.text_description}</td>
                      
                      <td><input type="text" value={rule.lookup_table ? rule.lookup_table : ''} disabled = {editable} onChange={(e) => handleInputChange(index, 'lookup_table', e.target.value)}
                      
                      /></td>
                      
                      <td>User</td>
                      
                      <td>{rule.last_updated_on}</td>
                      
                      {/* <td><input type="text" onChange={(e) => handleInputChange(index, 'rule.lookup_required', e.target.value)}
                      
                          /></td> */}
                      
                      <td>
                      
                      <select
                      
                      disabled = {editable}
                      
                       onChange={(e) => handleInputChange(index, 'rule_status', e.target.value)}
                      
                       >
                      
                       <option value="test1">test1</option>
                       <option value="test2">test2</option>
                      
                       <option value="test3">test3</option>
                      
                       </select>
                      
                      </td>
                      
                      </tr>
                      ))) :
                  (rules?.filter(rule => rule.isMandatory=="True").map((rule, index) => (
                  <tr key={index}>
                      <td>
                          <input 
                              type="checkbox" 
                              checked={rule.check_box}
                              disabled={editable}
                              onChange={() => handleCheckboxChange(index)} 
                          />
                      </td>
                      <td>{index}</td>
                      <td>
                          <input 
                              type="text" 
                              value={rule?.source_table || ''} 
                              disabled={editable}
                              onChange={(e) => handleInputChange(index, 'source_table', e.target.value)} 
                          />
                      </td>
                      <td>
                          <input 
                              type="text" 
                              value={rule?.source_field_name || ''} 
                              disabled={editable} 
                              onChange={(e) => handleInputChange(index, 'source_field_name', e.target.value)}
                          />
                      </td>
                      <td>
                          <select 
                              disabled={editable}
                              onChange={(e) => handleInputChange(index, 'data_mapping_type', e.target.value)}
                          >
                              <option value="1:1">1:1</option>
                              <option value="Constant">Constant</option>
                              <option value="LLM">LLM</option>
                          </select>
                      </td>
                      <td>
                          <input 
                              type="text" 
                              value={rule?.data_mapping_rules || ''} 
                              disabled={editable} 
                              onChange={(e) => handleInputChange(index, 'data_mapping_rules', e.target.value)}
                          />
                      </td>
                      <td>{rule.target_sap_table}</td>
                      <td>{rule.target_sap_field}</td>
                      <td>{rule.text_description}</td>
                      <td>
                          <input 
                              type="text" 
                              value={rule?.lookup_table || ''} 
                              disabled={editable} 
                              onChange={(e) => handleInputChange(index, 'lookup_table', e.target.value)}
                          />
                      </td>
                      <td>User</td>
                      <td>{rule.last_updated_on}</td>
                      <td>
                          <select 
                              disabled={editable}
                              onChange={(e) => handleInputChange(index, 'rule_status', e.target.value)}
                          >
                              <option value="test1">test1</option>
                              <option value="test2">test2</option>
                              <option value="test3">test3</option>
                          </select>
                      </td>
                  </tr>
              )))}
                </tbody>
            </table>
        </div>
 
        <div className="button-container">
            <button className="save-button" onClick={handleSubmit}>Save</button>
            <button className="version-button" onClick={handleVersion}>Version</button>
        </div>
        <style>
          {`
          /* CSS Modules or global CSS file */
.container {
    padding: 20px;
    font-family: Arial, sans-serif;
}
 
.filters {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}
 
.filter-form {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center; /* Center the form items */
}
 
.form-item {
    margin: 10px !important; /* Override Ant Design's default margins */
}
 
.rules-header {
    text-align: center;
    margin-bottom: 15px;
    color: #333;
}
 
.table-container {
    overflow-x: auto;
}
 
.rules-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
 
.rules-table th,
.rules-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}
 
.rules-table th {
    background-color: #f5f5f5;
    color: #555;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9em;
}
 
.rules-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}
 
.rules-table input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}
 
.button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
}
 
.save-button,
.version-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    color: white;
    background-color: #007bff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
 
.save-button:hover,
.version-button:hover {
    background-color: #0056b3;
}
 
/* Media query for smaller screens */
@media (max-width: 768px) {
    .rules-table {
        font-size: 0.8em;
    }
 
    .rules-table th,
    .rules-table td {
        padding: 8px;
    }
 
    .button-container {
        flex-direction: column; /* Stack buttons vertically */
        align-items: center;
    }
 
    .form-item {
        width: 100%; /* Make form items take full width on smaller screens */
    }
}
 
          `}
        </style>
        {/* {
          enabelPopUp &&
          <div style={popupStyle}>
              Do you really want to edit previous version
              <Button
              style={buttonStyle}
              onClick={()=>{
                // setEnabelPopUp(false);
                // setEditable(false);
              }}>Yes</Button>
              <Button
              style={buttonStyle}
              onClick={()=>{
                // setEnabelPopUp(false);
                // setEditable(true);
              }}>No</Button>
 
            </div>
          } */}
    </div>
);
};
 
export default RulesForm;