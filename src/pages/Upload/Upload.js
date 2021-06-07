import React from "react";

import "./Upload.css";


export default function Home() {

  const actionUrl = "/api/document/upload"

  return (
    <main className="main main--home">
        <form method="post" action={actionUrl} enctype="multipart/form-data">
            <input type="file" name="myFile"></input>
            <p>
                <input type="submit"></input>
            </p>
        </form>
    </main>
  );
};
