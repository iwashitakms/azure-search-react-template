import React from 'react';
import ListResult from './ListResult/ListResult';

import "./ListResults.css";

export default function Results(props) {

  let results = props.documents.map((result, index) => {
    return <ListResult 
        key={index} 
        document={result.document}
      />;
  });

  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {props.count.toLocaleString()} results</p>
      
      <div className="row row-cols-md-1 results">
        <table class="table">
        <tr>
          <th scope="col">タイトル</th>
          <th scope="col">無効</th>
          <th scope="col">年齢</th>
          <th scope="col">更新</th>
        </tr>
        {results}
        </table>
      </div>
    </div>
  );
};
