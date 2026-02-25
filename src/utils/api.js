import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

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
};

export default API;