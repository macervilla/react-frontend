import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

// 🔐 interceptor request (envía token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔄 interceptor response (maneja refresh)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si token expiró
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');

        const res = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem('access', newAccess);

        // reintenta request original
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default api;