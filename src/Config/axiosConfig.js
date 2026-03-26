import axios from 'axios';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.configure({ 
  showSpinner: false,     // Disable the spinning wheel
  speed: 500,             // Animation speed in ms
  minimum: 0.2,           // Minimum percentage to start at
  trickleSpeed: 200,      // How often to trickle progress
  easing: 'ease',         // CSS easing string
});

const api = axios.create({
    baseURL: "https://sweetalk-backend.onrender.com"
});

api.interceptors.request.use(
  (config) => {
    nprogress.start();
    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    nprogress.done();
    return Promise.reject(error); 
  }
);

api.interceptors.response.use(
    (response) => {
      nprogress.done(); 
      return response;
    },
    (error) => {
      nprogress.done();
      if (error.response && error.response.status === 401) {
          localStorage.clear();
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
      }
      return Promise.reject(error);
    }
);


export default api;