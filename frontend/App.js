import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ValueEngineerDashboard from './pages/ValueEngineerDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import ApproverDashboard from './pages/ApproverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/valueengineer" element={<ValueEngineerDashboard />} />
        <Route path="/receiver" element={<ReceiverDashboard />} />
        <Route path="/approver" element={<ApproverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
