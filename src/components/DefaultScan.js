import React, { useState, useRef } from 'react';
import axios from 'axios';

const DefaultScan = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Ref to the hidden file input
  const hiddenFileInputRef = useRef(null);

  // Styles
  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '24px',
    margin: '0 auto',
    width:'40vw',
    minHeight: '40vh'
  };
  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '50px',
    textAlign: 'center',
  };
  const titleDetailStyle = {
    fontSize: '1.5rem',
    fontWeight: '400',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const fileInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '50px',
  };
  // Browse button: muted style
  const browseButtonStyle = {
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '12px',
    fontSize: '1rem',
  };

  const fileNameStyle = {
    color: '#4b5563',
    fontSize: '1rem',
  };

  // Scan button: primary style and centered
  const scanButtonStyle = {
    backgroundColor: loading ? '#9ca3af' : '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '24px',
    fontSize: '1.1rem',
  };
  const centerStyle = {
    textAlign: 'center',
  };
  const resultStyle = {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '4px',
    overflow:'wrap',
    marginTop: '16px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  };

  // Handlers
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBrowseClick = () => {
    hiddenFileInputRef.current.click();
  };

  const token = localStorage.getItem('token');
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/api/scan_default', formData,authConfig)
      .then(res => {
        console.log(res.data);
        if(res.data.error){
          setError(res.data.error);
        }else{
          setResult(res.data.result);
        }
      });
    } catch (err) {
      setResult('Error scanning file');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Quick Scan</h2>
      <form onSubmit={onSubmit}>
        <h2 style={titleDetailStyle}>Select file:</h2>
        <div style={fileInputContainerStyle}>
          <button
            type="button"
            style={browseButtonStyle}
            onClick={handleBrowseClick}
          >
            Browse
          </button>
          <span style={fileNameStyle}>{file ? file.name : 'No file chosen'}</span>
          {/* Hidden file input */}
          <input
            type="file"
            ref={hiddenFileInputRef}
            onChange={onFileChange}
            accept=".exe,.pdf,.docx,.yar,.yara"
            style={{ display: 'none' }}
          />
        </div>
        <div style={centerStyle}>
          <button type="submit" style={scanButtonStyle}>
            Scan
          </button>
        </div>
      </form>
      {error && <div style={resultStyle}>{error}</div>}
      {result && (
        <div style={resultStyle}>
          <h3>Result:</h3>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
};

export default DefaultScan;
