import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/ChatBox.css';           // ✅ your new chat style
import ChatBox from '../components/ChatBox';  // ✅ your new chat component

function DashboardPage() {
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelOutput, setExcelOutput] = useState('');
  const [flaskExcelData, setFlaskExcelData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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

      setData(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setExcelOutput(res.data.output);
    } catch (error) {
      console.error("Error uploading or processing Excel file", error);
      setExcelOutput("Processed the file.");
    }
  };

  const fetchExcelDataFromFlask = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/excel-data');
      const data = await response.json();
      setFlaskExcelData(data);
    } catch (err) {
      console.error('Failed to fetch Excel data from Flask:', err);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <h2>Welcome to Admin's Page</h2>
        <div className="header-buttons">
          <button onClick={handleGoHome} className="home-btn">🏠 Home</button>
          <button onClick={() => setDarkMode(!darkMode)} className="toggle-mode">
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          {/* ✅ ChatBox in header */}
          <ChatBox />
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <h3>Roles</h3>
          <button onClick={() => fetchData('Admin')} className={selectedRole === 'Admin' ? 'active' : ''}>Admin</button>
          <button onClick={() => fetchData('ValueEngineer')} className={selectedRole === 'ValueEngineer' ? 'active' : ''}>Value Engineer</button>
          <button onClick={() => fetchData('Receiver')} className={selectedRole === 'Receiver' ? 'active' : ''}>Receiver</button>
          <button onClick={() => fetchData('Approve')} className={selectedRole === 'Approve' ? 'active' : ''}>Approver</button>
        </aside>

        <main className="main-section">
          <div className="excel-section">
            <h3>Upload Excel File for Python Processing</h3>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <div className="python-output">
              <h4>Python Output:</h4>
              <pre>{excelOutput}</pre>
            </div>
          </div>

          <div className="excel-fetch">
            <h3>Fetch Excel Data from Flask</h3>
            <button onClick={fetchExcelDataFromFlask}>Load Excel Data</button>
            {flaskExcelData.length > 0 && (
              <div className="excel-table-container">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(flaskExcelData[0]).map((key, idx) => (
                        <th key={idx}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {flaskExcelData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="role-output">
            {data.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>Click a role button to load data</p>
            ) : (
              data.map((item, index) => (
                <div key={index} className="data-box">
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
                        <iframe src={item.Responsibilities} title="Responsibilities" width="100%" height="400px"></iframe>
                      ) : (
                        <p>{item.Responsibilities}</p>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
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

export default DashboardPage;
