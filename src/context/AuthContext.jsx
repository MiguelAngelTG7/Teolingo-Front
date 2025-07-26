// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
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
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

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
      console.error('Login error:', err.message);
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
