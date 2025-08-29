import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false  // Changed to false for initial registration
});

// Interceptor para token
api.interceptors.request.use(
  (config) => {
    // Lista de endpoints públicos que no requieren token
    const publicEndpoints = [
      '/usuarios/registro/',
      '/usuarios/login/',
      '/usuarios/solicitar-reset-password/',
      '/usuarios/reset-password/',
      '/usuarios/verificar-email/'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Si no hay token y no es un endpoint público, rechazar la petición
        return Promise.reject(new Error('No hay token de autenticación'));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const getCursos = () => api.get('/cursos/');
export const getCurso = (id) => api.get(`/cursos/${id}/`);
export const getCursoDetail = (id) => api.get(`/cursos/${id}/`);
export const inscribirseEnCurso = (cursoId) => api.post(`/cursos/${cursoId}/`);
export const getLeccion = (id) => api.get(`/cursos/leccion/${id}/`);
export const getExamenFinal = (cursoId) => api.get(`/cursos/${cursoId}/examen-final/`);

export default api;