import axios from 'axios';

// Corregir el nombre de la variable de entorno
const baseURL = import.meta.env.VITE_API_URL || 'https://teolingo-back.onrender.com/api';

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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && 
        error.response.data.code === "token_not_valid") {
      // Limpiar el token expirado
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Redirigir a login
      window.location.href = '/login';
      return Promise.reject(new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'));
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const getCursos = () => api.get('/cursos/');
export const getCurso = (id) => api.get(`/cursos/${id}/`);
export const getCursoDetail = (id) => api.get(`/cursos/${id}/`);
export const inscribirseEnCurso = (cursoId) => api.post(`/cursos/${cursoId}/`);
export const getLeccion = (id) => api.get(`/cursos/leccion/${id}/`);
export const getExamenFinal = (cursoId) => api.get(`/cursos/${cursoId}/examen-final/`);

export default api;