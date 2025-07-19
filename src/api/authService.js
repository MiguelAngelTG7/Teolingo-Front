// src/api/authService.js
import api from './axiosConfig';

export const login = async (email, password) => {
  const response = await api.post('token/', {
    username: email,
    password: password,
  });
  return response.data; // incluye access y refresh tokens
};
