import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/Companydetail';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import MyApplications from './pages/student/MyApplications';
import AIMatches from './pages/student/AIMatches';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import PostJob from './pages/company/PostJob';
import ManageJobs from './pages/company/ManageJobs';
import ViewApplications from './pages/company/ViewApplications';

import Navbar from './components/shared/Navbar';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'company' ? '/company/dashboard' : '/student/dashboard'} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />
        <Route path="/student/ai-matches" element={<ProtectedRoute role="student"><AIMatches /></ProtectedRoute>} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute role="company"><CompanyProfile /></ProtectedRoute>} />
        <Route path="/company/post-job" element={<ProtectedRoute role="company"><PostJob /></ProtectedRoute>} />
        <Route path="/company/jobs" element={<ProtectedRoute role="company"><ManageJobs /></ProtectedRoute>} />
        <Route path="/company/applications/:jobId" element={<ProtectedRoute role="company"><ViewApplications /></ProtectedRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={
          <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>404</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Page not found</p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Go Home</button>
          </div>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </Router>
    </AuthProvider>
  );
}

export default App;