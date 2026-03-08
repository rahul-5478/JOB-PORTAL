import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

// ✅ NEW — App components
import SplashScreen from './components/shared/SplashScreen';
import AppNavbar from './components/shared/AppNavbar';
import Footer from './components/shared/Footer';

// Public
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CompanyDetail from './pages/Companydetail';
import Companies from './pages/Companies';
import Pricing from './pages/Pricing';
import ContactUs from './pages/Contactus';
import CompanyCategory from './pages/CompanyCategory';
import JobCategory from './pages/JobCategory';
import AIChatbot from './pages/AIChatbot';

// Live Jobs
import RealJobs from './pages/RealJobs';
import ExternalJobs from './pages/ExternalJobs';

// Service pages
import TextResume from './pages/services/TextResume';
import VisualResume from './pages/services/VisualResume';
import ResumeCritique from './pages/services/ResumeCritique';
import Jobs4u from './pages/services/Jobs4u';
import PriorityApplicant from './pages/services/PriorityApplicant';
import ResumeDisplay from './pages/services/ResumeDisplay';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import MyApplications from './pages/student/MyApplications';
import AIMatches from './pages/student/AIMatches';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import SalaryPredictor from './pages/student/SalaryPredictor';
import SkillAssessment from './pages/student/SkillAssessment';
import Interviews from './pages/student/Interviews';
import ResumeBuilder from './pages/student/ResumeBuilder';
import Chatbot from './pages/student/Chatbot';

// Company
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import PostJob from './pages/company/PostJob';
import ViewApplications from './pages/company/ViewApplications';

// Shared
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#07070f', color:'#fff', fontFamily:"'Sora',sans-serif" }}>
      <div style={{ width:36, height:36, border:'3px solid #1a1a2e', borderTopColor:'#f97316', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const NO_FOOTER = ['/chat', '/notifications', '/ai-assistant', '/ai-chatbot'];
const NO_FOOTER_PRE = ['/student/', '/company/', '/admin/'];

function Layout() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Splash — only once per session
  const [splashDone, setSplashDone] = useState(
    sessionStorage.getItem('tb_splash') === '1'
  );
  const handleSplashDone = () => {
    sessionStorage.setItem('tb_splash', '1');
    setSplashDone(true);
  };

  const showFooter = !NO_FOOTER.includes(pathname) &&
    !NO_FOOTER_PRE.some(p => pathname.startsWith(p));

  return (
    <>
      {/* ✅ Splash Screen */}
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div style={{
        opacity: splashDone ? 1 : 0,
        transition: 'opacity 0.4s ease 0.2s',
        minHeight: '100vh',
        paddingBottom: user ? 72 : 0,
      }}>
        {/* ✅ App Navbar with hamburger + bottom tabs */}
        <AppNavbar />

        {/* ✅ Page transition */}
        <div key={pathname} style={{ animation: 'pageSlide 0.25s ease' }}>
          <style>{`@keyframes pageSlide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}`}</style>

          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* AI Chatbot */}
            <Route path="/ai-chatbot" element={<AIChatbot />} />

            {/* Live Jobs */}
            <Route path="/real-jobs" element={<RealJobs />} />
            <Route path="/external-jobs" element={<ExternalJobs />} />

            {/* Services */}
            <Route path="/services/text-resume" element={<TextResume />} />
            <Route path="/services/visual-resume" element={<VisualResume />} />
            <Route path="/services/resume-critique" element={<ResumeCritique />} />
            <Route path="/services/jobs4u" element={<Jobs4u />} />
            <Route path="/services/priority-applicant" element={<PriorityApplicant />} />
            <Route path="/services/resume-display" element={<ResumeDisplay />} />

            {/* Jobs */}
            <Route path="/jobs/category/:category" element={<JobCategory />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs" element={<Jobs />} />

            {/* Companies */}
            <Route path="/companies/category/:category" element={<CompanyCategory />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/companies" element={<Companies />} />

            {/* Shared Protected */}
            <Route path="/chat" element={<ProtectedRoute roles={['student','company','admin']}><Chat /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute roles={['student','company','admin']}><Notifications /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute roles={['student']}><Chatbot /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>} />
            <Route path="/student/ai-matches" element={<ProtectedRoute roles={['student']}><AIMatches /></ProtectedRoute>} />
            <Route path="/student/resume-analyzer" element={<ProtectedRoute roles={['student']}><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/student/salary-predictor" element={<ProtectedRoute roles={['student']}><SalaryPredictor /></ProtectedRoute>} />
            <Route path="/student/skill-assessment" element={<ProtectedRoute roles={['student']}><SkillAssessment /></ProtectedRoute>} />
            <Route path="/student/interviews" element={<ProtectedRoute roles={['student']}><Interviews /></ProtectedRoute>} />
            <Route path="/student/resume-builder" element={<ProtectedRoute roles={['student']}><ResumeBuilder /></ProtectedRoute>} />

            {/* Company */}
            <Route path="/company/dashboard" element={<ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/profile" element={<ProtectedRoute roles={['company']}><CompanyProfile /></ProtectedRoute>} />
            <Route path="/company/post-job" element={<ProtectedRoute roles={['company']}><PostJob /></ProtectedRoute>} />
            <Route path="/company/applications" element={<ProtectedRoute roles={['company']}><ViewApplications /></ProtectedRoute>} />
            <Route path="/company/applications/:jobId" element={<ProtectedRoute roles={['company']}><ViewApplications /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {showFooter && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ style:{ background:'#1a1a2e', color:'#fff', border:'1px solid #7c6fff33' } }} />
          <Layout />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;