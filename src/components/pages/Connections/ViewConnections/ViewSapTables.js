import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Popconfirm, Input, message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CodeSandboxCircleFilled, DeleteOutlined, EditOutlined, FaRegEdit } from '@ant-design/icons';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import { useDispatch } from 'react-redux';
import { getSapTablesSlice, searchSaptablesSlice } from '../../../features/Connections/connectionSlice';
import { toast } from 'react-toastify';
 
const ViewSapTables = (field) => {
 
  // let loadCount = {count : 1};

  const location = useLocation()
  const getProjectId = location.pathname.split('/')[3] || null;
  const getConnectionName = location.pathname.split('/')[4] || null;
  const getConnectionType = location.pathname.split('/')[5] || null;
  console.log(getProjectId,getConnectionName,getConnectionType);
 
    const [searchText, setSearchText] = useState('');  
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loadCount , setLoadCount] = useState(1);
  const dispatch = useDispatch();
 
  const filteredData = tables?.filter(item => {  
    return (    
        item.table?.toLowerCase().includes(searchText.toLowerCase()) ||  
        item.description?.toLowerCase().includes(searchText.toLowerCase())
    );  
});
 
  
 
  const columns = [
    {
      title: 'Table Name',
      dataIndex: 'table',
      key: 'table',
    },
    {
      title: 'Table Description',
      dataIndex: 'description',
      key: 'description',
    },
   
  ];

  const sapTableSearch = (e)=>{
      dispatch(searchSaptablesSlice(e))
      .then(response=>{
        if(response?.payload?.status === 200){
          setTables(response?.payload?.data);
        }
        
      })
  }

  const blankSearch = (e)=>{
    console.log(e.target?.value);
    if(e.target?.value.length <= 0){
      dispatch(getSapTablesSlice(loadCount))
      .then((response)=>{
        console.log(response);
        if(response?.payload?.status === 200){
          setTables(response?.payload?.data); 
          setLoading(false);
        }
      })
    }
      console.log(e.target);
  }

  const loadMore = ()=>{
    setLoadCount(loadCount=>loadCount+1)
    console.log(loadCount);
    
  }

  useEffect(()=>{

    dispatch(getSapTablesSlice(loadCount))
      .then((response)=>{
        console.log(response);
        if(response?.payload?.status === 200){
          setTables(response?.payload?.data); 
          setLoading(false);
        }
      })

  },[loadCount])
 
  return (
   
<div>
    <div className="d-flex justify-content-end mb-2">
                    {/* <Input  
                        placeholder="Search by Table Name, Description"  
                        value={searchText}
                        // onChange={(e) => setSearchText(e.target.value)}  
                        style={{ maxWidth: 300 }} 
                    />   */}
                    <Search className='w-25' placeholder="Search by Table Name, Description" onChange={blankSearch} onSearch={sapTableSearch} enterButton />
                </div>
          <Table dataSource={filteredData} columns={columns} loading={loading}
          pagination={{ pageSize: 10 }}
          className='sapTable'
          /> 
          <Button onClick={loadMore}>Load More</Button>  
</div>
  );
};
 
export default ViewSapTables