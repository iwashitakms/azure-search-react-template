import React from 'react';

import './Result.css';

import { saveAs } from "file-saver";

import axios from 'axios';

export default function Result(props) {
    function getFileName(contentDisposition){
        let fileName = contentDisposition;
        //デコードするとスペースが"+"になるのでスペースへ置換します
        fileName = decodeURI(fileName).replace(/\+/g, " ");
    
        return fileName;
    }

    function download (e) 
    { 
        const fileName = e.currentTarget.getAttribute("fileName")

        const body = {
            fileName: encodeURIComponent(fileName)
        };
        axios.post('/api/document', body, {
                responseType: "blob"
                })
                .then(response => {
                const blob = new Blob([response.data], {
                    type: response.data.type
                });

                //レスポンスヘッダからファイル名を取得します
                const contentDisposition = decodeURI(response.headers["content-disposition"]);
                const fileName = getFileName(contentDisposition)

                //ダウンロードします
                saveAs(blob, fileName);
        });
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
