import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = ({myParentCallback}) => {
   const [selectedFile, setSelectedFile] = useState(null);

   const handleFileUpload = (event) => {
     setSelectedFile(event.target.files[0]);
   };

   const handleUpload = () => {
     const formData = new FormData();
     formData.append('file', selectedFile);
     axios.post('http://127.0.0.1:8000/recipe/uploadfile', formData)
       .then((response) => {
         myParentCallback(response.data.file_url);
       })
       .catch((error) => {
         console.log(error);
       });
   };
   return(
     <div>
       <h3>Upload File</h3>
       <input type="file" onChange={handleFileUpload} />
       <button onClick={handleUpload}>Upload</button>
     </div>
   );
};

export default UploadFile;