import api from './axiosConfig';

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
    localStorage.setItem('accessToken', response.data.access);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }
  throw new Error('Credenciales inválidas');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};