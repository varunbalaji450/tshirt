import React from 'react'
import * as yup from 'yup'
import { useFormik } from "formik";
import axios from 'axios';
import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';

const CSVFile = () => {
    const [file, setFile] = useState(null);
    const [fileNam, setFileNam] = useState('');

    // const handleSheetChange = (event) => {
    //     setSelectedOption(event.target.value);
    //     console.log('Selected:', event.target.value); // Log selected value
    // };

    let schema = yup.object().shape({
        // fileName: yup.string().required('File Name Required'),
        // filePath: yup.string().required('Path Required'),
        // sheet: yup.string().required('Worksheet Required'),
        // username:yup.string().required('Username Required'),
        // password:yup.string().required('Password Required'),
    })

    const formik = useFormik({
        initialValues: {
            // connectionname:getConnectionId || '',
            fileName: ""
        },
        validationSchema: schema,
        // onSubmit: async (values) => {
        //     try {
        //         const response = await fetch('http://127.0.0.1:8000/xlsx/', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'multipart/form-data',
        //             },
        //             body: 
        //         });

        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }

        //         const data = await response;

        //         console.log('Success:', data);
        //         alert("Connection Successful");
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert("Connection Failed");
        //     }
        // }
    })

    function handleFileChange(event) {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setFileNam(event.target.files[0].name);
            formik.handleChange('filePath')
            event.preventDefault()
        }
    }

    // const handleFormUpload = async() => {
    //     if (!file) return;
    //     const formData = new FormData();
    //     formData.append('fileName', formik.values.fileName); // Append first string
    //     // formData.append('sheet', selectedOption);
    //     formData.append('file', file);
    //     console.log(formData)
    //     try {
    //         const response = axios.post("http://127.0.0.1:8000/xlsx/", formData)
    //         // if (!response.ok) {
    //         //     throw new Error('Network response was not ok');
    //         // }
 
    //         const data = await response;
 
    //         console.log('Success:', data);
    //         alert("Connection Successful");
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert("Connection Failed");
    //     }
    // }

    async function handleFileUpload() {
        if (!file) return;
        // console.log(selectedFile);
        const formData = new FormData();
        formData.append('fileName', formik.values.fileName); // Append first string
        // formData.append('delimiter', formik.values.delimiter);
        formData.append('file', file);
        // console.log(formData);

        try {
            const response = axios.post("http://127.0.0.1:8000/csv/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            // console.log(response.data[0]);
            const data = await response;

            console.log('Success:', data);
            alert("Connection Successful");
            
        } catch (error) {
            console.error('Error:', error);
            alert("Connection Failed");
        }
    }



    return (
        <div className="d-flex justify-content-center">
            <div className="bg-light border rounded shadow " style={{ width: '500px', maxHeight: "450px" }}>
                <h3 className="text-center mt-4"> CSV File</h3>
                <form onSubmit={formik.handleSubmit} className="form-container">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">File Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formik.values.fileName}
                            name="fileName"
                            onChange={formik.handleChange('fileName')}
                        />
                        <div className="error">
                            {
                                formik.touched.fileName && formik.errors.fileName
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1" style = {{ marginLeft: "-5px"}}>File Path</label>
                        {/* <input
                            type="text"
                            className="form-control"
                            value={formik.values.filePath}
                            name="filePath"
                            onChange={formik.handleChange('filePath')}
                        /> */}
                        <input className="form-control" value={fileNam}></input>
                        <input type="file" 
                            className="form-control"
                            // value={file} 
                            name="filePath"
                            hidden id="browse" 
                            onChange={handleFileChange} />
                        <label htmlFor="browse" className="form-control">
                            Browse
                        </label>
                        <div className="error">
                            {
                                formik.touched.filePath && formik.errors.filePath
                            }
                        </div>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Sheet</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formik.values.sheet}
                            name="sheet"
                            onChange={formik.handleChange('sheet')}
                        />
                        <select value={selectedOption} className="form-control" onChange={handleSheetChange}>
                            {sheets.map((sheet, index) => (
                                <option key={index} value={sheet}>
                                    {sheet}
                                </option>
                            ))}
                        </select>
                        <div className="error">
                            {
                                formik.touched.sheet && formik.errors.sheet
                            }
                        </div>
                    </div> */}
                    <div style={{width:"100%",display:"flex", justifyContent:"flex-end",marginTop:"10px",marginRight:"15px"}}>
                    {file && formik.values.fileName && <button onClick={handleFileUpload} type="submit" className="btn btn-primary">Upload</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CSVFile;
