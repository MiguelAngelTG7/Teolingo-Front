import axios from 'axios';

// Add console log to debug the base URL
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://teolingo-back-production.up.railway.app/api',
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
    try {
        console.log('Attempting registration with URL:', `${api.defaults.baseURL}/usuarios/registro/`);
        console.log('Registration data:', { email, password, nombre_completo });
        
        const response = await api.post('/usuarios/registro/', { 
            email, 
            password,
            nombre_completo,
            confirm_password: password // Add this if your backend expects it
        });
        
        console.log('Registration response:', response);
        return response.data;
    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });
        throw error;
    }
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