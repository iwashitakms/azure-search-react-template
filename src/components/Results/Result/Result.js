import React from 'react';

import './Result.css';

import { saveAs } from "file-saver";

import axios from 'axios';

export default function Result(props) {

    async function download (e) 
    { 
        const fileName = e.currentTarget.getAttribute("fileName")

        const fileTitle = e.currentTarget.getAttribute("fileTitle")
        
        const body = {
            fileName: encodeURIComponent(fileName)
        };

        const response = await axios.post('/api/document', body, {
            responseType: "blob"
            });

        const blob = new Blob([response.data], {
                type: response.data.type
            });

        saveAs(blob, decodeURIComponent(fileTitle));
    };

    return(
        <div>
            <button onClick={download} fileName={props.document.metadata_storage_name} fileTitle={props.document.title} >{decodeURIComponent(props.document.title)}</button>
            <p>{props.document.content}</p>
        </div>
    );
}
