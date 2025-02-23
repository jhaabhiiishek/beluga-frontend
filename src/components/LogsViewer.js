import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LogsViewer = () => {
  const [logs, setLogs] = useState([]);

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

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginTop: '32px',
    marginBottom: '16px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    borderBottom: '2px solid #d1d5db',
    textAlign: 'left',
    padding: '12px',
    fontWeight: '600',
  };

  const tdStyle = {
    borderBottom: '1px solid #e5e7eb',
    padding: '12px',
    verticalAlign: 'top'
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/logs',config);
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs');
      }
    };
    fetchLogs();
  }, []);

  const basicLogs = logs.filter(log => log.scan_type !== "detailed");
  const detailedLogs = logs.filter(log => log.scan_type === "detailed");

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Scan Logs</h2>
      
      <h3 style={sectionTitleStyle}>Basic Scan Logs</h3>
      {basicLogs.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '1.1rem' }}>No basic logs available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>File</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Result</th>
              </tr>
            </thead>
            <tbody>
              {basicLogs.map(log => (
                <tr key={log.id}>
                  <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={tdStyle}>{log.filename}</td>
                  <td style={tdStyle}>{log.scan_type}</td>
                  <td style={tdStyle}>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>{log.result}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <hr style={{ marginTop: '32px', marginBottom: '32px' }} />
      
      <h3 style={sectionTitleStyle}>Detailed Scan Logs</h3>
      {detailedLogs.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '1.1rem' }}>No detailed logs available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>File</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Summary</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {detailedLogs.map(log => {
                let summary = "";
                try {
                  const detailed = JSON.parse(log.result);
                  const vtStats = detailed.vt_stats || {};
                  const malicious = vtStats.malicious || 0;
                  const total = Object.values(vtStats).reduce((a, b) => a + b, 0);
                  summary = `Detected threats: ${malicious} / ${total}`;
                } catch (err) {
                  summary = "N/A";
                }
                return (
                  <tr key={log.id}>
                    <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={tdStyle}>{log.filename}</td>
                    <td style={tdStyle}>{log.scan_type}</td>
                    <td style={tdStyle}>{summary}</td>
                    <td style={tdStyle}>
                      <Link to={`/logs/detailed/${log.id}`} style={{ textDecoration: 'none', color: '#2563eb', fontSize: '1rem' }}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsViewer;
