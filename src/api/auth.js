import axios from './axiosConfig';

export const register = async (email, password, nombre_completo) => {
  const response = await axios.post('/api/usuarios/registro/', {
    email,
    password,
    nombre_completo
  });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post('/api/token/', {
    username,
    password
  });
  if (response.data.access) {
    localStorage.setItem('accessToken', response.data.access);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};