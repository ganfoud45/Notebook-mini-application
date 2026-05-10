import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false, // ← changer true en false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('notebook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRequest =
      err.config?.url?.includes('/login') ||
      err.config?.url?.includes('/register') ||
      err.config?.url?.includes('/user');

    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('notebook_token');
      localStorage.removeItem('notebook_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register:       (data) => api.post('/register', data),
  login:          (data) => api.post('/login', data),
  logout:         ()     => api.post('/logout'),
  me:             ()     => api.get('/user'),
  changePassword: (data) => api.put('/user/password', data),
  deleteAccount:  (data) => api.delete('/user', { data }),
  getTags:        ()     => api.get('/tags'),
};

export const notesAPI = {
  getAll:    (params) => api.get('/notes', { params }),
  create:    (data)   => api.post('/notes', data),
  update:    (id, d)  => api.put(`/notes/${id}`, d),
  delete:    (id)     => api.delete(`/notes/${id}`),
  togglePin: (id)     => api.patch(`/notes/${id}/pin`),
  getStats:  ()       => api.get('/stats'),
};
