import React, { useState } from 'react';
import axios from 'axios';

const TenantSetup = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    shopifyDomain: '',
    accessToken: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3001/api/auth/register', formData);
      setSuccess('Store setup successfully! You can now login.');
      setTimeout(() => onComplete(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Setup New Shopify Store</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        
        <div className="form-group">
          <label>Store Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Shopify Domain (your-store.myshopify.com):</label>
          <input
            type="text"
            name="shopifyDomain"
            value={formData.shopifyDomain}
            onChange={handleChange}
            required
            placeholder="your-store.myshopify.com"
          />
        </div>
        
        <div className="form-group">
          <label>Shopify Access Token:</label>
          <input
            type="password"
            name="accessToken"
            value={formData.accessToken}
            onChange={handleChange}
            required
            placeholder="shpat_xxxxxxxxxxxxxxxx"
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Setting up...' : 'Setup Store'}
        </button>
        
        <button
          type="button"
          onClick={onComplete}
          style={{
            background: '#6c757d',
            marginTop: '1rem'
          }}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default TenantSetup;