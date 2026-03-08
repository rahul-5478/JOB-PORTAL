import axios from 'axios';

// ✅ Render pe deployed backend — laptop band ho ya on, hamesha kaam karega!
const BASE_URL = 'https://hireai-backend-jt4s.onrender.com/api';

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const jobAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get('/jobs/company/my-jobs'),
};

export const studentAPI = {
  getProfile: () => API.get('/students/profile'),
  updateProfile: (data) => API.put('/students/profile', data),
  uploadResume: (formData) => API.post('/students/upload-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadAvatar: (formData) => API.post('/students/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleSaveJob: (jobId) => API.post(`/students/save-job/${jobId}`),
  getAll: (params) => API.get('/students', { params }),
};

export const companyAPI = {
  getProfile: () => API.get('/companies/profile'),
  updateProfile: (data) => API.put('/companies/profile', data),
  uploadLogo: (formData) => API.post('/companies/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => API.get('/companies', { params }),
  getById: (id) => API.get(`/companies/${id}`),
  getDashboard: () => API.get('/companies/dashboard'),
};

export const applicationAPI = {
  apply: (jobId, data) => API.post(`/applications/apply/${jobId}`, data),
  getMyApplications: () => API.get('/applications/my-applications'),
  getJobApplications: (jobId, params) => API.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
  withdraw: (id) => API.delete(`/applications/${id}`),
};

export const aiAPI = {
  getJobMatches: () => API.get('/ai/job-matches'),
  scoreApplication: (id) => API.post(`/ai/score-application/${id}`),
  generateCoverLetter: (jobId) => API.post('/ai/generate-cover-letter', { jobId }),
  generateJobDescription: (data) => API.post('/ai/generate-job-description', data),
  analyzeResume: (data) => API.post('/ai/analyze-resume', data),
  predictSalary: (data) => API.post('/ai/salary-predict', data),
  getSkillQuiz: (skill) => API.get(`/ai/skill-quiz/${skill}`),
};

export const chatAPI = {
  getConversations: () => API.get('/chat/conversations'),
  getMessages: (userId) => API.get(`/chat/messages/${userId}`),
  sendMessage: (data) => API.post('/chat/send', data),
  getUsers: () => API.get('/chat/users'),
};

export const interviewAPI = {
  schedule: (data) => API.post('/interviews/schedule', data),
  getMy: () => API.get('/interviews/my'),
  update: (id, data) => API.put(`/interviews/${id}`, data),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markAllRead: () => API.put('/notifications/read-all'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  delete: (id) => API.delete(`/notifications/${id}`),
};

export default API;