// Obtener el examen final de un curso
export const getExamenFinal = (cursoId) => api.get(`/cursos/${cursoId}/examen-final/`);
// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Función opcional para setear el token globalmente
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ENDPOINTS

export const getCursos = () => api.get('/cursos/');

export const getCurso = (id) => api.get(`/cursos/${id}/`);

export const getCursoDetail = getCurso;

export const getLeccion = (id) => api.get(`/lecciones/${id}/`);

export default api;
