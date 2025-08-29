import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
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
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const register = async (email, password, nombre_completo) => {
  const response = await api.post('/usuarios/registro/', { 
    email, 
    password,
    nombre_completo 
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/usuarios/login/', { 
    email, 
    password 
  });
  
  if (response.data.access) {
    // Guardamos los tokens
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    
    // Guardamos los datos del usuario que vienen en la respuesta
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }
  throw new Error('No se recibió el token de acceso');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// API endpoints
export const getCursos = () => api.get('/cursos/');
export const getCurso = (id) => api.get(`/cursos/${id}/`);
export const getCursoDetail = (id) => api.get(`/cursos/${id}/`);
export const inscribirseEnCurso = (cursoId) => api.post(`/cursos/${cursoId}/`);
export const getLeccion = (id) => api.get(`/cursos/leccion/${id}/`);
export const getExamenFinal = (cursoId) => api.get(`/cursos/${cursoId}/examen-final/`);

export default api;