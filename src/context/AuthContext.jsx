import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
      setAuthToken(savedToken); // ✅ token para axios
    }
  }, []);

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

      setAccessToken(data.access);
      setUser({ username });

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('user', JSON.stringify({ username }));

      setAuthToken(data.access); // ✅ token para axios

      return true;
    } catch (err) {
      console.error('Login error:', err.message);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAuthToken(null); // ✅ limpiar token de axios
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
