import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [access, setAccess] = useState(() => localStorage.getItem('access'));

  // Cada vez que cambie el token lo guardamos (o lo quitamos) en localStorage
  useEffect(() => {
    if (access) localStorage.setItem('access', access);
    else localStorage.removeItem('access');
  }, [access]);

  const login = (newAccess) => setAccess(newAccess);
  const logout = () => setAccess(null);

  return (
    <AuthContext.Provider value={{ access, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
