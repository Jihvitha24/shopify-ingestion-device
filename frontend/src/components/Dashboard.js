import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar
} from 'recharts';

const Dashboard = ({ user, onLogout }) => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/dashboard/metrics', {
        headers: {
          'x-tenant-id': user.tenant.id,
          'Authorization': `Bearer ${user.token}`
        }
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post('http://localhost:3001/api/shopify/sync', {}, {
        headers: {
          'x-tenant-id': user.tenant.id,
          'Authorization': `Bearer ${user.token}`
        }
      });
      await fetchDashboardData();
      alert('Data synced successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Welcome, {user.tenant.name}</h1>
        <div>
          <button onClick={handleSync} disabled={syncing} style={{ marginRight: '10px', width: 'auto' }}>
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
          <button onClick={onLogout} style={{ background: '#dc3545', width: 'auto' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Customers</h3>
          <p className="metric-value">{metrics.totalCustomers || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Total Orders</h3>
          <p className="metric-value">{metrics.totalOrders || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">${(metrics.totalRevenue || 0).toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Avg Order Value</h3>
          <p className="metric-value">${(metrics.averageOrderValue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Orders Over Time</h3>
          <LineChart width={500} height={300} data={metrics.ordersByDate || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="chart-container">
          <h3>Top Customers by Spend</h3>
          <BarChart width={500} height={300} data={metrics.topCustomers || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="email" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSpent" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;