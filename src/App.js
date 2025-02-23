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
    margin: 0
  };

  // Minimal header style with only a subtle bottom border
  const headerStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  };

  const headerInnerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  // Flat, modern nav style with minimal border and no shadows
  const navStyle = {
    backgroundColor: '#ffffff',
    padding: '1rem 0',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
  };

  const navListStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    listStyleType: 'none',
    padding: 0,
  };

  // New modern nav item style: flat, clean, with rounded edges
  const navItemStyle = {
    backgroundColor: '#f7f7f7',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '500',
    border: '1px solid #ddd',
    textDecoration: 'none',
    color: 'black',
    transition: 'transform 0.15s ease-in-out',
  };

  // Modern flat auth buttons for Login/Signup and Logout (no box shadow)
  const authButtonStyle = {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    marginLeft: '12px',
    transition: 'transform 0.15s ease-in-out',
  };

  const authLinkStyle = {
    textDecoration: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    borderRadius: '25px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: '500',
    marginLeft: '12px',
    transition: 'transform 0.15s ease-in-out',
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
    borderTop: '1px solid #e0e0e0',
    padding: '1rem',
    textAlign: 'center',
  };

  return (
    <Router>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div style={headerInnerStyle}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Beluga - A Malware Detection Tool
            </h1>
            <div>
              {authToken ? (
                <button
                  onClick={handleLogout}
                  style={authButtonStyle}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" style={authLinkStyle}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'none'}
                  >
                    Login
                  </Link>
                  <Link to="/signup" style={authLinkStyle}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'none'}
                  >
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
              <Link to="/" style={navItemStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                Quick Scan
              </Link>
            </li>
            <li>
              <Link to="/detailed" style={navItemStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                Detailed Scan
              </Link>
            </li>
            <li>
              <Link to="/custom" style={navItemStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                Custom Scan
              </Link>
            </li>
            <li>
              <Link to="/builder" style={navItemStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                YARA Rule Builder
              </Link>
            </li>
            <li>
              <Link to="/logs" style={navItemStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
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
            © 2025 Beluga - A Malware Detection Tool. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
