import React from 'react';

import './Result.css';

import { saveAs } from "file-saver";

import axios from 'axios';

export default function Result(props) {

    function download (e) 
    { 
        // const fileName = e.currentTarget.getAttribute("fileName")
        
        // const body = {
        //     fileName: encodeURIComponent(fileName)
        // };

        // const response = await axios.post('/api/document', body, {
        //     responseType: "blob"
        //     });

        // const blob = new Blob([response.data], {
        //         type: response.data.type
        //     });

        // saveAs(blob, fileName);
    
    };

    return(
        <div>
            <button onClick={download} fileName={props.document.metadata_storage_name}>{props.document.metadata_storage_name}</button>
            {/* <a href={`/api/document/${props.document.metadata_storage_name}`}>
                <h6 className="title-style">{props.document.metadata_storage_name}</h6>
            </a> */}
            <p>{props.document.content}</p>
        </div>
    );
}
