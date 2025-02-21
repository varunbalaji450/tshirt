import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Input } from 'antd';
import { ToastContainer } from 'react-toastify';
 
const CreateBussinessRules = () => {
 
 
    const navigate = useNavigate();  
    const [uploadedFileName, setUploadedFileName] = useState('');  
    const [file, setFile] = useState(null);  
 
 
    const location = useLocation();
    const getConnectionName = location.pathname.split('/')[3] || null;
 
    // async function handleFileUpload(selectedFile) {
    //     if (!selectedFile) return;
    //     const formData = new FormData();
    //     formData.append('file', selectedFile);
    //     try {
    //         const response = await axios.post("http://127.0.0.1:8000/xls/", formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         })
    //     } catch { };
    // }
 
 
    const formik = useFormik({  
        initialValues: {  
            data_object_name: '',  
            filePath: '',  
        },  
        validationSchema: Yup.object({  
            data_object_name: Yup.string().required('Required'),  
            filePath: Yup.string().required('File is required'),  
        }),  
        onSubmit: async(values) => {  
            if (!file) return;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('obj_name',formik.values.data_object_name)
            formData.append('project_id',59)
            formData.append('file_name',file.name)
            try {
                const num = 36
            const response = await axios.put(`http://127.0.0.1:8000/api/ObjUpdate/${num}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        } catch { };
        }  
    });  
 
    const handleObjectName = async (selectedFile) => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        try{
            const response = await axios.post("http://127.0.0.1:8000/xls/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response)
            formik.setFieldValue('data_object_name', response.data.trim())
        } catch {

        }
    }


    const handleFileChange = (event) => {
        console.log(event.target.files[0]);  
        const selectedFile = event.target.files[0];  
       
        if (selectedFile) {  
            setUploadedFileName(selectedFile.name);  
            setFile(selectedFile);  
            formik.setFieldValue('filePath', selectedFile.name);
            // formik.setFieldValue('data_object_name', selectedFile.name.split('.')[0]);
            handleObjectName(selectedFile);
        }  
    };  
 
    const handleRemoveFile = () => {  
        setUploadedFileName('');  
        setFile(null);  
        formik.setFieldValue('filePath', ''); // Clear Formik's state  
    };  
 
 
 
 
  return (
    <div>
        <ToastContainer
          position='top-center'
          autoClose={1000}
          hideProgressBar={true}
          closeOnClick
          newestOnTop={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          />
          <div className="d-flex justify-content-center">  
            <div className="bg-light border rounded shadow p-2">  
                <h3 className="text-center"> Create Data Mapping Rules</h3>  
                <form onSubmit={formik.handleSubmit} className="form-container" style={{width:"400px"}}>  
                   
                    <div>  
                        <label htmlFor="data_object_name">Data Object Name</label>  
                        <Input  
                            type="text"  
                            name="data_object_name"  
                            value={formik.values.data_object_name}  
                            onChange={formik.handleChange('data_object_name')}  
                        />  
                        <div className="error">{formik.touched.data_object_name && formik.errors.data_object_name}</div>  
                    </div>  
 
                    <div>
                            <label htmlFor="exampleInputEmail1">File Path</label>
                            <div className='d-flex'>
                            <Input  value={uploadedFileName}/>
                            <Input type="file"
                                className="form-control primary"
                                // value={file}
                                name="filePath"
                                hidden id="browse"
                                onChange={handleFileChange} />
                            <label htmlFor="browse">
                                Browse
                            </label>
                            </div>
                            <div className="error">
                                {
                                    formik.touched.filePath && formik.errors.filePath
                                }
                            </div>
                        </div>
 
                    <div className='d-flex justify-content-around w-75 mt-2'>  
                        <input type='submit' className='btn btn-primary' value={getConnectionName !== null ? 'ReUpload' : 'Upload'} />  
                        <input type='button' className="btn btn-danger" onClick={() => navigate("/bussinessrules/manage")} value={'Cancel'} />  
                    </div>  
                </form>    
            </div>  
        </div>
    </div>
  )
}
 
export default CreateBussinessRules