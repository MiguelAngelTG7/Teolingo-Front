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
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const register = async (email, password, nombre_completo) => {
    try {
        const response = await api.post('/usuarios/registro/', { 
            email, 
            nombre_completo,
            password,
            confirm_password: password
        });
        
        // Check if registration was successful
        if (response.status === 201) {
            return {
                success: true,
                message: 'Por favor revisa tu correo electrónico para verificar tu cuenta',
                data: response.data
            };
        }
        
        throw new Error('Error en el registro');
    } catch (error) {
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            throw new Error(error.response.data.message || 'Error en el registro');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No se pudo conectar con el servidor');
        } else {
            // Something happened in setting up the request
            throw new Error('Error al procesar la solicitud');
        }
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