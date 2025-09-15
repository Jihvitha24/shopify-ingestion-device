import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TenantSetup from './components/TenantSetup';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenantData = localStorage.getItem('tenant');
    
    if (token && tenantData) {
      setUser({ token, tenant: JSON.parse(tenantData) });
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (token, tenant) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tenant', JSON.stringify(tenant));
    setUser({ token, tenant });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenant');
    setUser(null);
    setCurrentView('login');
  };

  const handleSetupComplete = () => {
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login onLogin={handleLogin} onShowSetup={() => setCurrentView('setup')} />
      )}
      {currentView === 'setup' && (
        <TenantSetup onComplete={handleSetupComplete} />
      )}
      {currentView === 'dashboard' && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;