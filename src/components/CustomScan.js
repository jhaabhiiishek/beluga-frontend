import React, { useState, useRef } from 'react';
import axios from 'axios';

const CustomScan = () => {
  const [exeFile, setExeFile] = useState(null);
  const [yaraFile, setYaraFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const exeInputRef = useRef(null);
  const yaraInputRef = useRef(null);

  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '32px',
    margin: '0 auto',
    minHeight: '40vh'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: '50px',
    marginTop: '50px',
  };

  const labelStyle = {
    fontSize: '1.5rem',
    fontWeight: '400',
    textAlign: 'center',
  };

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

  const scanButtonStyle = {
    backgroundColor: loading ? '#9ca3af' : '#16a34a',
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
    padding: '16px',
    borderRadius: '6px',
    marginTop: '24px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '1rem',
  };

  
  const token = localStorage.getItem('token');
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  // Handlers
  const onExeChange = (e) => setExeFile(e.target.files[0]);
  const onYaraChange = (e) => setYaraFile(e.target.files[0]);

  const handleExeBrowseClick = () => {
    exeInputRef.current.click();
  };

  const handleYaraBrowseClick = () => {
    yaraInputRef.current.click();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!exeFile || !yaraFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('exe_file', exeFile);
    formData.append('yara_file', yaraFile);
    try {
      const res = await axios.post('http://localhost:5000/api/scan_custom', formData,authConfig);
      setResult(res.data.result);
    } catch (err) {
      setResult('Error scanning file with custom rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Scan using Custom YARA Rule</h2>
      <form onSubmit={onSubmit}>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>File to check:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>

            <button type="button" style={browseButtonStyle} onClick={handleExeBrowseClick}>
              Browse
            </button>
            <span style={fileNameStyle}>{exeFile ? exeFile.name : 'No file chosen'}</span>
            <input
              type="file"
              ref={exeInputRef}
              onChange={onExeChange}
              accept=".exe,.pdf,.docx"
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>YARA Rule File:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="button" style={browseButtonStyle} onClick={handleYaraBrowseClick}>
              Browse
            </button>
            <span style={fileNameStyle}>{yaraFile ? yaraFile.name : 'No file chosen'}</span>
            <input
              type="file"
              ref={yaraInputRef}
              onChange={onYaraChange}
              accept=".yar,.yara"
              style={{ display: 'none' }}
            />
          </div>
          
        </div>
        <div style={centerStyle}>
          <button type="submit" style={scanButtonStyle} disabled={loading}>
            Scan
          </button>
        </div>
      </form>
      {loading && (
        <div style={centerStyle}>
          <p style={{ fontSize: '1.1rem' }}>Scanning...</p>
        </div>
      )}
      {result && (
        <div style={resultStyle}>
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CustomScan;
