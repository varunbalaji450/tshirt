import React, { useState, useEffect, useRef } from 'react';
import { Select, Table, Button, Input, message } from 'antd';
import { createStyles } from 'antd-style';
import { useParams , Link} from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TbFileExport } from "react-icons/tb";
import { CgEnter, CgProfile } from "react-icons/cg";
import {useSelector} from 'react-redux';
import { IoIosHome } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { Tooltip } from 'antd';
import { LuSaveAll } from "react-icons/lu";
 
const ColorSwatch = ({ color, text }) => {
    return (
      <div style={{  display: 'flex', alignItems: 'center', marginRight: '20px' ,marginLeft: '20px'}}> {/* Adjust marginLeft as needed */}
        <div
          style={{
            width: '18px',
            height: '18px',
            backgroundColor: color,
            border: '1px solid #ccc', // Optional border
            marginRight: '10px',
            borderRadius: '50%'
          }}
          />
        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{text}</span>
      </div>
    );
};
 
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
 
const ReportTshirt = () => {
    const {styles} = useStyle();
    const navigate = useNavigate();
    const { projectName } = useParams();
    const { totalEfforts } = useParams();
    const [txt, setTxt] = useState();
    const [realize, setRealize] = useState();
    const [live, setLive] = useState();
    const [mock, setMock] = useState();
    const [colorrealize, setColorRealize] = useState('');
    const [colorlive, setColorLive] = useState('');
    const [colCnt, setColCnt] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [allTotalDays, setAllTotalDays] = useState(0);
    const [allTotalHours, setAllTotalHours] = useState(0);
    const [error, setError] = useState('');
    const[popUp, setPopUp] = useState(false);
    const [msgText, setMsgText] = useState();
    const [displayMsgText, setDislayMsgText] = useState(false);
    const tempName = useSelector((state) => state.user.user);
 
 
    const colorData = [
        { color: 'lightyellow', text: 'Preparation Phase' },
        { color: 'white', text: 'Realization / Object Development Phase' },
        { color: 'green', text: 'Go Live Phase'         },
        { color: 'lightgreen', text: 'Hypercare Phase' }
    ];
 
 
    useEffect(() => {
        console.log("bhoom");
       
        let temp = [];
        console.log("Helo");
        axios.get(`http://127.0.0.1:8000/report_get/${projectName}/`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    temp = res.data;
                    console.log(res);
                    const lastRow = res.data[res.data.length - 4]; // Get the last row (totals)
                    const dataWithoutTotals = res.data.slice(0, res.data.length - 4); // Remove last row
                    const objLength = Object.keys(res.data[0]).length - 5;
                    setColCnt(objLength);
                    setTxt(objLength);
                    setRealize(res.data[res.data.length - 2].realize);
                    setLive(res.data[res.data.length - 1].live);
                    setMock(res.data[res.data.length - 3].iterations);
                    setColorRealize(res.data[res.data.length - 2].realize);
                    setColorLive(res.data[res.data.length - 1].live);
                   
                    setAllTotalDays(lastRow.Total_Days);
                    setAllTotalHours(lastRow.Total_Hours);
                   
                    const dataWithKeys = dataWithoutTotals.map((item, index) => ({
                        ...item,
                        key: item.id || index // Use ID if available, otherwise index (only if order is fixed)
                    }));
                    setDataSource(dataWithKeys);
 
                    // setDataSource(temp); // Set data directly here
                } else {
                    console.log("No data or empty data received.");
                    setDataSource([]);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []); // Add projectName to dependency array
 
 
    const handleSelectChange = (index, field, value) => {
        setDataSource(prevDataSource => {
            if (value === "Remove") {
                // Remove the row if "Remove" is selected
                const newDataSource = prevDataSource.filter((_, i) => i !== index);
                console.log(newDataSource);
                const newAllTotalDays = newDataSource.reduce((sum, item) => (sum + (item.Total_Days || 0)), 0);
                const newAllTotalHours = newDataSource.reduce((sum, item) => (sum + (item.Total_Hours || 0)), 0);
 
                // Update the state with the new totals:
                setAllTotalDays(newAllTotalDays);
                setAllTotalHours(newAllTotalHours);
 
                return newDataSource;
            } else {
                // Update the row if a different value is selected
                const newDataSource = [...prevDataSource];
                newDataSource[index][field] = value;
                return newDataSource;
            }
        });
    };
 
    const handleInputChange = (e, record, dataIndex) => {
        const newValue = e.target.value;
       
        const value = e.target.value;
        // if (/^\d*$/.test(value))
        if (/^\d+(\.\d{0,1})?$/.test(value))
 
        {            
            setDataSource(prevDataSource => {
                const updatedDataSource = prevDataSource.map(item => {
                    if (item.key === record.key) {
                        const updatedItem = { ...item, [dataIndex]: newValue };
   
                        let totalDays = 0;
                        for (let i = 1; i <= colCnt; i++) {
                            // const weekValue = parseInt(updatedItem[`W${i}`], 10) || 0;
                            const weekValue = parseFloat(updatedItem[`W${i}`]) || 0.0;
                            totalDays += weekValue;
                        }
   
                        updatedItem.Total_Days = totalDays;
                        updatedItem.Total_Hours = totalDays * 8;
                        return updatedItem;
                    }
                    return item;
                });
               
   
                // Calculate totals for all rows *after* updating the data source
                const allTotalDays = updatedDataSource.reduce((sum, item) => sum + item.Total_Days, 0);
                const allTotalHours = updatedDataSource.reduce((sum, item) => sum + item.Total_Hours, 0);
           
                // You'll likely need to store these totals in state as well
                setAllTotalDays(allTotalDays); // Assuming you have state for allTotalDays
                setAllTotalHours(allTotalHours); // And state for allTotalHours
   
                return updatedDataSource; // Return the updated data source
            });
        }
    };
 
    // const { styles } = useStyle();
 
    const fixedColumns = [
        {
            title: 'YASH Consultants',
            width: 280,
            dataIndex: 'Yash_Consultant',
            key: 'Yash_Consultant',
            fixed: 'left',
            render: (text, record, index) => (
                <Select
                    defaultValue={text}
                    style={{ width: 265 }}
                    onChange={(value) => handleSelectChange(index, 'Yash_Consultant', value)} // Correct field name
                >
                    <Select.Option value="Project Manager">Project Manager</Select.Option>
                    <Select.Option value="Lead - Data Migration Consultant">Lead - Data Migration Consultant</Select.Option>
                    <Select.Option value="Sr Data Migration Consultant">Sr Data Migration Consultant</Select.Option>
                    <Select.Option value="Data Migration Consultant">Data Migration Consultant</Select.Option>
                    <Select.Option value="Remove">Remove</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Role',
            width: 140,
            dataIndex: 'Role',
            key: 'Role',
            fixed: 'left',
            render: (text, record, index) => (
                <Select
                    defaultValue={text}
                    style={{ width: 120 }}
                    onChange={(value) => handleSelectChange(index, 'Role', value)} // Correct field name
                >
                    <Select.Option value="Technical">Technical</Select.Option>
                    <Select.Option value="Functional">Functional</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Location',
            width: 150,
            dataIndex: 'Location',
            key: 'Location',
            fixed: 'left',
            render: (text, record, index) => (
                <Select
                    defaultValue={text}
                    style={{ width: 120 }}
                    onChange={(value) => handleSelectChange(index, 'Location', value)} // Correct field name
                >
                    <Select.Option value="Offshore">Offshore</Select.Option>
                    <Select.Option value="Onsite">Onsite</Select.Option>
                </Select>
            ),
        },
    ];
 
    const middleColumns = [];
 
    for (let i = 1; i <= colCnt; i++) {
        const isFirstThree = i < colorrealize;
        const isLastThree = i >= colorlive; // Calculate dynamically
   
        middleColumns.push({
            title: `W${i}`,
            dataIndex: `W${i}`,
            key: `W${i}`,
            render: (text, record) => {
                let dynamicWidth = Math.max(45, Math.floor(100 / colCnt)); // Calculate width without 'px'
 
                // Adjust width if colCnt is 1
                if (colCnt === 1) {
                    dynamicWidth = 450; // or any other appropriate width for a single column
                }
 
                let inputStyle = { width: `${dynamicWidth}px` }; // Apply 'px' here
                if (isFirstThree) {
                    inputStyle = { ...inputStyle, backgroundColor: 'lightyellow' };
                }
   
                if (isLastThree) {
                    inputStyle = { ...inputStyle, backgroundColor: 'lightgreen' };
                }
   
                if (i === live) {
                    inputStyle = { ...inputStyle, backgroundColor: 'green', color: 'white' };
                }
                return (
                    <Input
                        value={text}
                        onChange={(e) => handleInputChange(e, record, `W${i}`)}
                        style={inputStyle}
                       
                    />
                );
            },
        });
    }
 
    const lastColumns = [
        {
            title: 'Total Days',
            dataIndex: 'Total_Days',
            width: 80,
            fixed: 'right',
            render: (text) => (
                <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span> // Inline styles
            )
           
        },
        {
            title: 'Total Hours',
            dataIndex: 'Total_Hours',
            width: 80,
            fixed: 'right',
            render: (text) => (
                <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span> // Inline styles
            )
        },
    ];
 
    const columns = [...fixedColumns, ...middleColumns, ...lastColumns];
 
    const handelTextBox = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only integers
            setTxt(value);
        }
    };
    const handelRealizeBox = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only integers
            setRealize(value);
        }
    };
    const handelLiveBox = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only integers
            setLive(value);
        }
    };
 
    const handleMockBox = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only integers
            setMock(value);
        }
    };
 
    const handelButtonSubmit = () => {
        console.log(" deadpool ");
       
        let temp = [];
 
        let t1 = parseInt(txt, 10), r1 = parseInt(realize, 10), l1 = parseInt(live, 10), m1 = parseInt(mock, 10);
        console.log(t1);
        console.log(r1);
        console.log(l1);
        console.log(m1);
 
            if(t1<=0 || r1<=0 || l1<=0 || m1<=0){
                if ((!t1 || !r1 || !l1 || !m1) && t1!==0  && m1!==0  && l1!==0  && r1!==0 ) {
                    message.warning('Field values cannot empty', 1);
                    return;
                }
                message.warning('Field values cannot be 0 ', 1);
                return;
            }
        // if(t1<=0 || r1<=0 || l1<=0 || m1<=0){
        //     if (!t1 || !r1 || !l1 || !m1) {
        //         message.warning('Field values cannot empty', 1);
        //         return;
        //     }
        //     message.warning('Field values cannot be 0 ', 1);
        //     return;
        // }
        // if (!t1 || !r1 || !l1 || !m1) {
        //     message.warning('Field values cannot empty', 1);
        //     return;
        // }
       
        if(t1 <= r1){
            message.warning('realization value cannot be greater than project Duration weeks', 1.75);
            return;
        }
        if(t1 <= l1){
            message.warning('live value cannot be greater than project Duration weeks', 1.75);
            return;
        }
        if(r1 >= l1){
            message.warning('live value should be less than realization weeks', 1.75);
            return;
        }
        if(m1 <1 || m1>3){
            message.warning('mock iterations should be 1 or 2 or 3 only ', 1.75);
            return;
        }
 
 
        let val = {
            "project_name": projectName,
            "weeks": parseInt(txt, 10),
            "realize" : parseInt(realize, 10),
            "live" : parseInt(live, 10),
            "iterations" : parseInt(mock,10)
        };
        axios.post(`http://127.0.0.1:8000/report_creation/`, val)
            .then(res => {
                console.log(res);
                console.log("Successfully created the dynamic table");
               
                if (res.data && res.data.length > 0) {
                    temp = res.data;
                    console.log(res);
                    const lastRow = res.data[res.data.length - 3]; // Get the last row (totals)
                    const dataWithoutTotals = res.data.slice(0, res.data.length - 3); // Remove last row
                    const objLength = Object.keys(res.data[0]).length - 5;
                    setColCnt(objLength);
                    setTxt(objLength);
                    setRealize(res.data[res.data.length - 2].realize);
                    setLive(res.data[res.data.length - 1].live);
                    setColorRealize(res.data[res.data.length - 2].realize);
                    setColorLive(res.data[res.data.length - 1].live);
                    setAllTotalDays(lastRow.Total_Days);
                    setAllTotalHours(lastRow.Total_Hours);
                   
                    const dataWithKeys = dataWithoutTotals.map((item, index) => ({
                        ...item,
                        key: item.id || index // Use ID if available, otherwise index (only if order is fixed)
                    }));
                    setDataSource(dataWithKeys);
 
                    // setDataSource(temp); // Set data directly here
                } else {
                    console.log("No data or empty data received.");
                    setDataSource([]);
                }
 
 
            })
            .catch(err => {
                console.error('outer axios error');
                console.error(err);
                return;
            });
       
    };
    const handelSaveReport = () => {
       
        console.log("final temp");
 
        console.log(totalEfforts);
 
        let diff = (Math.abs(totalEfforts - allTotalDays)/totalEfforts)*100
        console.log(diff)
 
        if(diff > 25)
        {
            setPopUp(true);
        }else{
            setPopUp(false);
           
            let temp = {
                Yash_Consultant: null,
                Role: null,
                Location: null,
                Total_Days: allTotalDays,
                Total_Hours: allTotalHours,
            };
       
            for (let i = 1; i <= colCnt; i++) {
                temp[`W${i}`] = null;
            }
       
   
             const dataWithoutKeys = dataSource.map(item => {
                const newItem = { ...item }; // Create a copy
                delete newItem.key; // Remove the key property
                return newItem;
            });
       
            delete temp.key; // Remove key from temp object
       
            let finalTemp = [...dataWithoutKeys, temp]; // Use dataWithoutKeys
       
            console.log(finalTemp);
       
            axios.put(`http://127.0.0.1:8000/report_update/${projectName}/`, finalTemp)
                .then(res => {
                    console.log('sent data');
                })
                .catch(err => {
                    console.error(err);
                });
 
            // setMsgText('Saved Successfully');
            message.success('Saved successfully!', 1);
 
 
        }
    };
 
 
 
    const handleExcel = async () => {
        try {
             
            const downloadResponse = await axios.post(`http://127.0.0.1:8000/report_to_excel/`,
                dataSource,
            {
                responseType: 'blob', // C rucial: Get response as a blob
            });
   
            const blob = new Blob([downloadResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName}__TimeLine.xlsx`; // Set the filename
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
    const handleConfirmationYes = ()=>{
        // ....... api Callbacks.
        setPopUp(false);
 
 
        let temp = {
            Yash_Consultant: null,
            Role: null,
            Location: null,
            Total_Days: allTotalDays,
            Total_Hours: allTotalHours,
        };
   
        for (let i = 1; i <= colCnt; i++) {
            temp[`W${i}`] = null;
        }
   
 
         const dataWithoutKeys = dataSource.map(item => {
            const newItem = { ...item }; // Create a copy
            delete newItem.key; // Remove the key property
            return newItem;
        });
   
        delete temp.key; // Remove key from temp object
   
        let finalTemp = [...dataWithoutKeys, temp]; // Use dataWithoutKeys
   
        console.log(finalTemp);
   
        axios.put(`http://127.0.0.1:8000/report_update/${projectName}/`, finalTemp)
            .then(res => {
                console.log('sent data');
            })
            .catch(err => {
                console.error(err);
            });
        // success msg
        // setMsgText('Saved Successfully');
        message.success('Saved successfully!', 1);
       
    }
 
    const handleConfirmationNo = ()=>{
        setPopUp(false);
    }
    const boxStyle = {
        backgroundColor: 'lightgray',
        padding: '8px 12px', // Adjusted padding for centering
        borderRadius: '5px',
        marginBottom: '5px',
        display: 'inline-block',
        fontWeight: 'bold',
        textAlign: 'center', // Center the text horizontally
        minWidth: '45px', // Set a minimum width for consistent box size
      };
 
 
    return (
        <>
        <div style={{
            // display: 'flex', flexDirection: 'column',justifyContent: 'space-between'  ,alignItems: 'center' ,
            gap: '5px', padding: '15px' }}>
           
        <div style={{ marginBottom: '20px', marginLeft: '50px',
             display: 'flex', flexDirection: 'column',alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '25px',alignContent:'center', marginTop:'6px'  }}>                
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s"
                    style={{width: '100px', height: '50px', marginRight:'10px', cursor: 'pointer' }}
                    onClick={()=>{
                        console.log('clicked');
                        navigate(`/`);}}
                    ></img>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1>Project TimeLine</h1>
                    <div style={{display: 'inline'}}>
                    </div>
                </div>
            </div>
               
           
 
           
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}> {/* Key change: flexWrap: 'nowrap' */}
                <label style={{ marginRight: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Project TimeLine Duration(In weeks):
                </label>
                <Input
                    type="text"
                    placeholder="No of weeks"
                    value={txt}
                    onChange={handelTextBox}
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        maxWidth: '50px', // Or adjust as needed
                    }}
                />
 
                <label style={{ marginRight: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Realize Phase Starts from(In weeks):
                </label>
                <Input
                    type="text"
                    placeholder="Enter Realize weeks starts from"
                    value={realize}
                    onChange={handelRealizeBox}
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        maxWidth: '50px', // Or adjust as needed
                    }}
                    // disabled =
                />
 
                <label style={{ marginRight: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Go Live Week At:
                </label>
                <Input
                    type="text"
                    placeholder="Go Live starts from"
                    value={live}
                    onChange={handelLiveBox}
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        maxWidth: '50px', // Or adjust as needed
                    }}
                />
 
                <label style={{ marginRight: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Mock Iterations:
                </label>
                <Input
                    type="text"
                    placeholder="Mock Iterations"
                    value={mock}
                    onChange={handleMockBox}
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        maxWidth: '50px', // Or adjust as needed
                    }}
                />
                 <Button
                        onClick={handelButtonSubmit}
                        type="primary"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            marginRight: '10px',
                            marginLeft : '30px'
                        }}
                    >
                        Submit
                    </Button>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'right',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginRight : '8px'}} >
                        <Button
                        onClick={()=>{
                            navigate('/')
                        }}
                        type="primary"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            marginRight: '15px',
                        }}
                    >
                        <Tooltip title="Home">
                        <IoIosHome/>
                        </Tooltip>
                    </Button>
                   
                    <div >
                    <Tooltip title="save">
                        <Button onClick={handelSaveReport}
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            marginRight: '15px',
                        }}
                         >
                        <LuSaveAll />
                        </Button>
                    </Tooltip>
                    </div>
                   
 
                    <Button
                        onClick={handleExcel}
                        type="primary"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            ':hover': {
                                backgroundColor: '#45a049',
                                content : 'Hii' // Example hover color
                            }
                           
                        }}
                    >
                        <Tooltip title="Export to Excel">
 
                        <FaDownload />
                        {/* Export to Excel */}
                        {/* <TbFileExport /> */}
                        </Tooltip>
                    </Button>
                </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
 
 
            <Table
                className="custom-table report-table"
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                style={{ width: '100%' }}
                scroll={{
                    x: 2000,
                    y: 264,
                }}
            />
 
            {dataSource.length!==0 &&(<div
            style={{ display: 'flex',
                justifyContent: 'space-between',
                //  alignItems: 'center'
                }}
                >
               
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginLeft:'1075px' }}>
                    <div style={{ marginRight: '48px', display: 'flex' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={boxStyle}>{allTotalDays}</div>
                            <div style={{ ...boxStyle, marginLeft: '35px' }}>{allTotalHours}</div>
                        </div>
                        </div>
                    </div>
               
            </div>
            )}
 
 
            {popUp && (
                    <div
                        style={{
                            position: 'fixed', // Stay in place
                            top: '10%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center the popup
                            backgroundColor: 'white',
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            zIndex: 1000, // Ensure it's on top
                        }}
                    >
                        <p>The difference is less than 25%. Do you still want to save the effort?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={handleConfirmationYes} style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Yes
                            </button>
                            <button onClick={handleConfirmationNo} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                No
                            </button>
                        </div>
                    </div>
                )}  
 
   
 
        </div>
        {dataSource.length!==0 &&(<div style={{ display: 'flex' }}> {/* Column for vertical stacking */}
                {colorData.map((item, index) => (
                <ColorSwatch key={index} color={item.color} text={item.text} />
                ))}
            </div>)}
        </>
 
    );
};
 
export default ReportTshirt;
 
 