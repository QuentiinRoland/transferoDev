import React, { useState, useRef } from 'react';

function FileTransfer({ deviceId, deviceName }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [transferStatus, setTransferStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [transferHistory, setTransferHistory] = useState([]);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    console.log("Fichiers sélectionnés:", files.map(f => f.name));
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

}
