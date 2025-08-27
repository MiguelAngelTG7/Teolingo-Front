import axios from './axiosConfig';

export const register = async (email, password) => {
  const response = await axios.post('/auth/register/', {
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post('/auth/login/', {
    email,
    password
  });
  localStorage.setItem('accessToken', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};