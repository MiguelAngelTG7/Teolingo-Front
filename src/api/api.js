// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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

export const getLeccion = (id) => api.get(`/lecciones/${id}/`);

export default api;
