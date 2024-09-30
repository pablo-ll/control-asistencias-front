import axios from 'axios';
import { getEnvVariables } from 'helpers';

const { VITE_APP_API_URL } = getEnvVariables();

const controlAsistenciaApi = axios.create({
    baseURL: VITE_APP_API_URL,
});

export default controlAsistenciaApi;

// Add a request interceptor
controlAsistenciaApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return config;
}, error => {
    // Maneja errores de solicitud aquí si es necesario
    return Promise.reject(error);
});

controlAsistenciaApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
        }
        return Promise.reject(error);
    }
);