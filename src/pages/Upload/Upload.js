import React from "react";
import axios from 'axios';
import useRef from 'react';
import "./Upload.css";

export default function UploadDocument() {

  const actionUrl = "/api/document/upload"
  const fileRef = useRef(null)

  // const handleSetImage = (e) => {
  //   if (!e.target.files) return
  //   const file = fileRef.target.files[0]
  //   fileRef(file)
  // }

  const handleSubmitProfileIcon = () => {

    const param = new FormData()
    if (!fileRef.current.files[0]) return

    param.append('data', fileRef.current.files[0])

    const parameterUrl = actionUrl + "?name=" + encodeURIComponent(fileRef.current.files[0].name);

    axios
      .post(
        parameterUrl,
        param,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      )
      .then(x => alert(JSON.stringify(x.statusText)));
  }

  return (
    <main className="main main--home">
        <form>
            <input type="file" name="myFile" ref={fileRef}></input>
            <br />
            <button 
              variant="contained"
              color="primary"
              type="button"
              onClick={handleSubmitProfileIcon}
            >アップロード
            </button >
        </form>
    </main>
  );
};
