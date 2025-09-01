import React, { useState } from 'react';
import '../styles/Dashboard.css';

function ApproverDashboard() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Approve');

  const fetchData = async (role) => {
    setSelectedRole(role);
    try {
      const empRes = await fetch(`http://localhost:5000/api/employees?role=${role}`);
      const resRes = await fetch(`http://localhost:5000/api/responsibilities?role=${role}`);
      const empData = await empRes.json();
      const resData = await resRes.json();

      const combined = [
        ...empData.map(e => ({ type: 'employee', ...e })),
        ...resData.map(r => ({ type: 'responsibility', ...r }))
      ];

      setData(prev => [...prev, ...combined]); // Append new data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <h2>Welcome Approver</h2>
        <div className="header-buttons">
          <button className="home-btn" onClick={() => window.location.reload()}>🏠 Home</button>
          <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <h3>Tasks</h3>
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} onClick={() => fetchData(selectedRole)}>Task{i}</button>
          ))}

          <h3>Other Roles</h3>
          <button
            onClick={() => fetchData('Approve')}
            className={selectedRole === 'Approve' ? 'active' : ''}
          >
            Approver
          </button>
          <button
            onClick={() => fetchData('ValueEngineer')}
            className={selectedRole === 'ValueEngineer' ? 'active' : ''}
          >
            ValueEngineer
          </button>
        </aside>

        <main className="content-area">
          {data.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>Click a task or role to load data</p>
          ) : (
            data.map((item, idx) => (
              <div key={idx} className="data-box">
                {item.type === 'employee' ? (
                  <>
                    <h4>{item.EmpName}</h4>
                    <p><b>Role:</b> {item.EmpRole}</p>
                    <p><b>Division:</b> {item.EmpDivision}</p>
                    <p><b>Section:</b> {item.EmpSection}</p>
                    <p><b>Group:</b> {item.EmpGroup}</p>
                    <p><b>Designation:</b> {item.EmpDesignation}</p>
                  </>
                ) : (
                  <>
                    <h4>Responsibility</h4>
                    {item.Responsibilities.startsWith('http') ? (
                      <iframe
                        src={item.Responsibilities}
                        width="100%"
                        height="400px"
                        title="Responsibilities"
                      ></iframe>
                    ) : (
                      <p>{item.Responsibilities}</p>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </main>
      </div>

      <footer className="dashboard-footer">
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

export default ApproverDashboard;
