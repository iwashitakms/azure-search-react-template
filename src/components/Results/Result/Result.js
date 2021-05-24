import React from 'react';

import './Result.css';

export default function Result(props) {
    return(
        <div>
            <a href={`/details/${props.document.id}`}>
                <h6 className="title-style">{props.document.metadata_storage_name}</h6>
            </a>
            <p>{props.document.content}</p>
        </div>
    );
}
