import React from 'react';

import { useRef } from 'react';

import './ListResult.css';

import axios from 'axios';

export default function Result(props) {

    async function update(e) 
    { 
        const fileName = e.currentTarget.getAttribute("fileName");

        const age = textRef.current.value;

        const disable = boxRef.current.checked;

        const body = {
            fileName: fileName,
            age: age,
            disable: disable
        };

        const response = await axios.post('/api/document/update', body, {
             responseType: "json"
             });

        alert(JSON.stringify(response));
    
    };

    const textRef = useRef(null);

    const boxRef = useRef(null);

    const disable = props.document.disable === "true";

    return(
        <tr>
            <td>{decodeURIComponent(props.document.title)}</td>
            <td onclick="getElementById('checkbox').click();">
                <input ref={boxRef} type="checkbox" id="checkbox" onclick="this.click()" defaultChecked={disable}></input>
            </td>
            <td>
                <input ref={textRef} type="number" name="number" defaultValue={props.document.age}></input>
            </td>
            <td>
                <button fileName={props.document.metadata_storage_name} onClick={update}>更新</button>
            </td>
        </tr>
    );
}
