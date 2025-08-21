// src/api/authService.js
import api from './axiosConfig';

export const login = async (username, password) => {
  const response = await api.post('token/', {
    username: username,
    password: password,
  });
  return response.data; // incluye access y refresh tokens
};
