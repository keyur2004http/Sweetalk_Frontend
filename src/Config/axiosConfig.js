import axios from 'axios';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.configure({ 
  showSpinner: false,     
  speed: 500,              
  minimum: 0.2,            
  trickleSpeed: 200,      
  easing: 'ease',         
});

const api = axios.create({
    baseURL:'http://localhost:8080'
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