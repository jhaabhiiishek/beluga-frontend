import React, { useState } from 'react';
import axios from 'axios';

const RuleBuilder = () => {
  const [ruleName, setRuleName] = useState("MyRule");
  const [strings, setStrings] = useState("");
  const [operator, setOperator] = useState("and");
  const [generatedRule, setGeneratedRule] = useState("");

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

  const labelStyle = {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '500',
    fontSize: '1rem',
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

  const generateButtonStyle = {
    backgroundColor: '#6b21a8',
    color: '#ffffff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '24px',
    fontSize: '1.1rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
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
    fontSize: '1rem',
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/build_rule', {
        rule_name: ruleName,
        strings: strings,
        operator: operator,
      });
      setGeneratedRule(res.data.generated_rule);
    } catch (err) {
      setGeneratedRule('Error generating rule');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>YARA Rule Builder</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label style={labelStyle}>Rule Name:</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Enter Strings (comma-separated):</label>
          <input
            type="text"
            value={strings}
            onChange={(e) => setStrings(e.target.value)}
            placeholder="e.g., virus,malware,attack"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Condition Operator:</label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            style={inputStyle}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>
        <div style={centerStyle}>
          <button type="submit" style={generateButtonStyle}>
            Generate Rule
          </button>
        </div>
      </form>
      {generatedRule && (
        <div style={resultStyle}>
          <h3>Generated YARA Rule:</h3>
          <pre>{generatedRule}</pre>
        </div>
      )}
    </div>
  );
};

export default RuleBuilder;
