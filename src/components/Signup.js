import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: '"San Francisco", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '50px',
    textAlign: 'center',
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

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', { email, password }).then(
		response => {
			console.log(response.data);
			if(response.data.error){
				setMessage(response.data.error);
			}else{
				setMessage("Signup successful! Please login.");
				navigate('/login');
			}
		}
	  )
    } catch (err) {
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Signup</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Signup
        </button>
      </form>
      {message && <p style={{ textAlign: 'center', fontSize: '1.1rem', marginTop: '16px' }}>{message}</p>}
    </div>
  );
};

export default Signup;
