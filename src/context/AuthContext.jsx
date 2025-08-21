// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { setAuthToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Verificar si el token está expirado
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return expiryTime > Date.now();
    } catch (error) {
      console.error('Token inválido o malformado');
      return false;
    }
  };

  // Cargar token y usuario al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      if (isTokenValid(savedToken)) {
        setAccessToken(savedToken);
        setUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      } else {
        logout(); // token inválido o expirado
      }
    }
  }, []);

  // Función para hacer login
  const login = async (username, password) => {
    try {
      const res = await api.post('token/', { username, password });
      const data = res.data;

      if (!isTokenValid(data.access)) {
        throw new Error('Token recibido no válido');
      }

      setAccessToken(data.access);
      setUser({ username });

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('user', JSON.stringify({ username }));

      setAuthToken(data.access);

      return true;
    } catch (err) {
      // Axios error: puede tener response.data.detail
      const detail = err?.response?.data?.detail || err.message;
      console.error('Login error:', detail);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
