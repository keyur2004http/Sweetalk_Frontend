import axios from 'axios';
const api = axios.create({
    baseURL: 'https://sweetalk-backend.onrender.com'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;