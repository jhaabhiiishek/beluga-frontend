import React, { useState, useRef } from 'react';
import axios from 'axios';

const DetailedScan = () => {
  const [file, setFile] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const fileInputRef = useRef(null);

  // Updated container style: bigger width & iOS-inspired font
  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '32px',
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
    padding: '16px',
    borderRadius: '6px',
    marginTop: '24px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '1rem',
  };

  // Spinner styles
  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '24px'
  };

  const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    animation: "spin 2s linear infinite",
    marginRight: "12px"
  };
  const inputStyle = {
    display: 'block',
    width: '95%',
    padding: '2.5%',
    marginBottom: '24px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
  };
  // Handlers
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
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
    if(apiKey.trim()){
      formData.append('api_key', apiKey.trim());
    }
    try {
      const res = await axios.post('http://localhost:5000/api/scan', formData,authConfig);
      setResult(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("Backend error:", err.response.data);
        setError(err.response.data.error || 'Error scanning file');
      } else {
        setError('Error scanning file');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderVerdict = (verdict) => {
    if (verdict === "Clean") {
      return <span style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>✅ Clean</span>;
    } else {
      return <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>❌ Malicious</span>;
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Detailed Scan Analysis</h2>
      <form onSubmit={onSubmit}>
        <h2 style={titleDetailStyle}>Select file:</h2>
        <div style={fileInputContainerStyle}>
          <button type="button" style={browseButtonStyle} onClick={handleBrowseClick}>
            Browse
          </button>
          <span style={fileNameStyle}>{file ? file.name : 'No file chosen'}</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept=".exe,.pdf,.docx,.yar,.yara"
            style={{ display: 'none' }}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              VirusTotal API Key (optional):
            </label>
            <input
              type="text"
              placeholder="Enter your API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={inputStyle}
            />
          </div>
        <div style={centerStyle}>
          <button type="submit" style={scanButtonStyle} disabled={loading}>
            Detailed Scan
          </button>
        </div>
        {loading && (
          <div style={spinnerContainerStyle}>
            <div style={spinnerStyle}></div>
            <span style={{ fontSize: '1.1rem' }}>Loading detailed scan...</span>
          </div>
        )}
      </form>
      {error && <div style={resultStyle}>{error}</div>}
      {result && (
        <div style={resultStyle}>
          <h3>File: {result.file}</h3>
          <p><strong>File Type:</strong> {result.file_type}</p>
          <p><strong>Overall Vulnerability Score:</strong> {result.vulnerability_score}%</p>
          <p><strong>VirusTotal Score:</strong> {result.virustotal_score}%</p>
          <p>
            <strong>YARA Matches:</strong>{" "}
            {result.yara_matches && result.yara_matches.length > 0
              ? result.yara_matches.join(', ')
              : "None"}
          </p>
          {result.risk_factors && Object.keys(result.risk_factors).length > 0 && (
            <div>
              <strong>Risk Factors:</strong>
              <ul>
                {Object.entries(result.risk_factors).map(([rule, strings]) => (
                  <li key={rule}>
                    <em>{rule}</em>: {strings.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.vt_stats && (
            <div>
              <strong>VirusTotal Statistics:</strong>
              <ul>
                {Object.entries(result.vt_stats).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          <p><strong>Final Verdict:</strong> {renderVerdict(result.verdict)}</p>
          {/* Dropdown to show full API response */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => setShowFullResponse(!showFullResponse)}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {showFullResponse ? 'Hide' : 'Show'} Full API Response
            </button>
            {showFullResponse && (
              <pre style={{ marginTop: '16px', backgroundColor: '#e5e7eb', padding: '12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
      {/* Inject keyframes for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DetailedScan;
