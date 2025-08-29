// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth";

const AuthContext = createContext();

const getInitialState = () => {
  try {
    const token = localStorage.getItem("accessToken") || null;
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (error) {
    console.error("Error loading auth state:", error);
    // Si hay algún error, limpiamos el localStorage y retornamos estado inicial limpio
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialState();
  const [accessToken, setAccessToken] = useState(initialState.token);
  const [user, setUser] = useState(initialState.user);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      if (data.access) {
        setAccessToken(data.access);
        
        // Si obtenemos datos del usuario, actualizamos el estado
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Si no hay datos de usuario en la respuesta, intentamos obtenerlos del localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      // Si tenemos token pero no usuario, intentamos obtener los datos del usuario
      if (!user) {
        const fetchUserData = async () => {
          try {
            const response = await api.get('/usuarios/perfil/');
            if (response.data) {
              setUser(response.data);
              localStorage.setItem("user", JSON.stringify(response.data));
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
        fetchUserData();
      }
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [accessToken, user]);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
