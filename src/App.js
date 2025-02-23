import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DefaultScan from './components/DefaultScan';
import DetailedScan from './components/DetailedScan';
import CustomScan from './components/CustomScan';
import RuleBuilder from './components/RuleBuilder';
import LogsViewer from './components/LogsViewer';
import DetailedLogEntry from './components/DetailedLogEntry';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || "");

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken("");
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    margin: 0
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const headerInnerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const navStyle = {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
  };

  const navListStyle = {
    display: 'flex',
    gap: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    listStyleType: 'none',
    padding: 0,
  };

  const mainStyle = {
    flex: 1,
    margin: '2rem auto',
    padding: '1rem',
    minWidth: '60vw',
    minHeight: '60vh',
  };

  const footerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
    textAlign: 'center',
  };

  return (
    <Router>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div style={headerInnerStyle}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Malware Detection Tool
            </h1>
            <div>
              {authToken ? (
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '12px' }}>
                    Login
                  </Link>
                  <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li>
              <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Quick Scan
              </Link>
            </li>
            <li>
              <Link to="/detailed" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Detailed Scan
              </Link>
            </li>
            <li>
              <Link to="/custom" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Custom Scan
              </Link>
            </li>
            <li>
              <Link to="/builder" style={{ color: '#2563eb', textDecoration: 'none' }}>
                YARA Rule Builder
              </Link>
            </li>
            <li>
              <Link to="/logs" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Scan Logs
              </Link>
            </li>
          </ul>
        </nav>
        <main style={mainStyle}>
          <Routes>
            <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
            <Route path="/signup" element={<Signup setAuthToken={setAuthToken} />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DefaultScan />
              </ProtectedRoute>
            } />
            <Route path="/detailed" element={
              <ProtectedRoute>
                <DetailedScan />
              </ProtectedRoute>
            } />
            <Route path="/custom" element={
              <ProtectedRoute>
                <CustomScan />
              </ProtectedRoute>
            } />
            <Route path="/builder" element={
              <ProtectedRoute>
                <RuleBuilder />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <LogsViewer />
              </ProtectedRoute>
            } />
            <Route path="/logs/detailed/:id" element={
              <ProtectedRoute>
                <DetailedLogEntry />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer style={footerStyle}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            © 2025 Malware Detection Tool. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
