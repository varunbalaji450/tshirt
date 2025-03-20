import React, { useEffect, useState } from 'react';  
import { Input, Popover } from 'antd';
 
export const EditableField = ({ value, onUpdate,disabled,source }) => {  
    const [inputValueSource, setInputValueSource] = useState(value);
 
    useEffect(() => {  
        setInputValueSource(value);
    }, [value]);  
 
    const changeValue = (e) => {  
        setInputValueSource(e?.target?.value);  
    };  
 
    const handleBlur = () => {  
        onUpdate(inputValueSource);
    };  
 
    return (  
        <div>        
        <Input  
            // style={{  
            //     width: 150,  
            //     height: 50,  
            //     borderRadius: "0px",  
            //     border: "none"
            // }}    
            // className='disabled-button'
            // disabled={disabled}
            value={inputValueSource}
            onChange={(e) => changeValue(e)}
            onBlur={handleBlur}
        />  
        </div>
    );  
};
 
 