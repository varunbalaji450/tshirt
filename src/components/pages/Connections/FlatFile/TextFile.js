import React from 'react'
import * as yup from 'yup'
import { useFormik } from "formik";
import axios from 'axios';
import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';


const TextFile = () => {
    const [file, setFile] = useState(null);
    const [fileNam, setFileNam] = useState('');

    const formik = useFormik({
        initialValues: {
            // connectionname:getConnectionId || '',
            fileName: "",
            delimiter: ""
        }
    })

    function handleFileChange(event) {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setFileNam(event.target.files[0].name);
            formik.handleChange('filePath')
            event.preventDefault()
        }
    }

    async function handleFileUpload() {
        if (!file) return;
        // console.log(selectedFile);
        const formData = new FormData();
        formData.append('fileName', formik.values.fileName); // Append first string
        formData.append('delimiter', formik.values.delimiter);
        formData.append('file', file);
        // console.log(formData);

        try {
            const response = axios.post("http://127.0.0.1:8000/txt/", formData, {
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
                <h3 className="text-center mt-4"> Text File</h3>
                <form className="form-container">
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
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Delimiter</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formik.values.delimiter}
                            name="fileName"
                            onChange={formik.handleChange('delimiter')} />
                        <div className="error">
                            {
                                formik.touched.fileName && formik.errors.fileName
                            }
                        </div>
                    </div>
                    <div style={{width:"100%",display:"flex", justifyContent:"flex-end",marginTop:"10px",marginRight:"15px"}}>
                    {file && formik.values.fileName && <button onClick={handleFileUpload} type="submit" className="btn btn-primary">Upload</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TextFile
