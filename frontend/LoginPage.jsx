import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';

import AdminDashboard from './DashboardPage';
import ValueEngineerDashboard from './ValueEngineerDashboard';
import ReceiverDashboard from './ReceiverDashboard';
import ApproverDashboard from './ApproverDashboard';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [userRole, setUserRole] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // 'info' | 'about' | 'more'
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      if (res.data.success) {
        setUserRole(res.data.role);
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login error');
    }
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'Admin':
        return <AdminDashboard userRole="Admin" />;
      case 'ValueEngineer':
        return <ValueEngineerDashboard />;
      case 'Receiver':
        return <ReceiverDashboard />;
      case 'Approve':
        return <ApproverDashboard />;
      default:
        return null;
    }
  };

  if (userRole) {
    return renderDashboard(); // Full-screen dashboard after login
  }

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="login-header">
        <h2>Welcome to the Portal</h2>
        <div className="header-buttons">
          <button className="home-btn" onClick={() => window.location.reload()}>🏠 Home</button>
          <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="login-body">
        {/* Left Panel: Info Section */}
        <div className="info-section">
          <div className="toggle-buttons-group">
            <button className="toggle-button" onClick={() => setActiveSection(activeSection === 'info' ? null : 'info')}>
              {activeSection === 'info' ? '− Info' : '+ Info'}
            </button>
            <button className="toggle-button" onClick={() => setActiveSection(activeSection === 'about' ? null : 'about')}>
              {activeSection === 'about' ? '− About' : '+ About'}
            </button>
            <button className="toggle-button" onClick={() => setActiveSection(activeSection === 'more' ? null : 'more')}>
              {activeSection === 'more' ? '− Know More' : '+ Know More'}
            </button>
          </div>

          {activeSection === 'info' && (
            <div className="info-content">
              <p>
                Welcome to the Central Operations Portal. This system manages
                employee roles, responsibilities, and task tracking across all
                divisions. Only authorized personnel may log in using the
                credentials listed below. Data access is strictly role-based
                for security and operational clarity.
              </p>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="info-content">
              <p>
                This portal streamlines internal operations by connecting
                departments through a single interface. Developed for seamless
                collaboration, it ensures accuracy, accountability, and data
                transparency within teams working across engineering, logistics,
                finance, and HR.
              </p>
            </div>
          )}

          {activeSection === 'more' && (
            <div className="info-content">
              <p>
                Role-specific dashboards provide employees with access to only
                the data they need. Integration with Excel and MongoDB enables
                fast uploads, visual tracking, and easy analysis for
                management-level users like Admin and Approvers.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Login Form */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>Follow us:</p>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">▶️ YouTube</a>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
