import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailedLogEntry = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs');
        const entry = res.data.find(item => item.id === parseInt(id));
        setLog(entry);
      } catch (err) {
        console.error("Error fetching log entry", err);
      }
    };
    fetchLog();
  }, [id]);

  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '32px',
    margin: '0 auto',
    minHeight: '40vh'
  };

  if (!log) {
    return <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Loading...</p>;
  }

  let detailedResult = {};
  try {
    detailedResult = JSON.parse(log.result);
  } catch (err) {
    detailedResult = { error: "Could not parse log details" };
  }

  let summary = "";
  if (detailedResult.vt_stats) {
    const vtStats = detailedResult.vt_stats;
    const malicious = vtStats.malicious || 0;
    const total = Object.values(vtStats).reduce((a, b) => a + b, 0);
    summary = `Detected threats: ${malicious} / ${total} sources`;
  }

  const detailStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '1rem',
    backgroundColor: '#f3f4f6',
    padding: '16px',
    borderRadius: '6px'
  };

  return (
    <div style={containerStyle}>
      <h2>Detailed Analysis for {log.filename}</h2>
      <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
      <p><strong>Scan Type:</strong> {log.scan_type}</p>
      <p><strong>Overall Vulnerability Score:</strong> {detailedResult.vulnerability_score}%</p>
      <p><strong>VirusTotal Score:</strong> {detailedResult.virustotal_score}%</p>
      <p><strong>Summary:</strong> {summary}</p>
      <h3>Full Detailed Result:</h3>
      <pre style={detailStyle}>
        {JSON.stringify(detailedResult, null, 2)}
      </pre>
    </div>
  );
};

export default DetailedLogEntry;
